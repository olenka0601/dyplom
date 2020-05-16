const electron = require('electron');
const {ipcRenderer} = electron;

function getNewId() {
  return (Date.now()+'').substr(4);
}

function updateTitle() {
    let boxes = document.querySelectorAll('.dd .dropdown-content label');
    [].forEach.call(boxes, (box) => {
      box.addEventListener('click', (e) => {
        const forValue = e.currentTarget.getAttribute('for');
        const actTitle = document.querySelector('.page-title.active');
        const nextTitle = document.querySelector('.page-title[data-title-for="' + forValue + '"]' );
        actTitle.classList.remove('active');
        nextTitle.classList.add('active');
      });
    });
}

function getElementFromText(content) {
  const div = document.createElement('div');
  div.insertAdjacentHTML('afterBegin', content);
  return div.firstElementChild;
}

function oneStudentTempalte(number, id, name, marks) {
  const inputlabel = 'studentNameFieldPlaceholder';
  const dates = Object.keys(marks||{});
  name = name || '';
  const fieldedInputs = dates.map(key=>`<td><input value="${marks[key]}" class="input_ocena"></td>`).join('');
  return `<tr class='students-row' data-student-id=${id}>
    <td class="mainTD">${number}       
      <input class='studentName-edit' value="${name}" placeholder="${lang(inputlabel)}" translate-label="${inputlabel}"/>
    </td>
    ${fieldedInputs}
    ${'<td><input class="input_ocena"></td>'.repeat(15-dates.length)}
    </tr>`;
} 

function oneStudentDataTemplate(number, student) {
  const inputlabel = 'studentNameFieldPlaceholder';
  name = name || '';
  student = student || {
    fullname: '',
    birthday: '',
    jobs: '',
    parents: '',
    parentsphones: '',
    uniqueCode: '',
  };
  return `<tr class='studentsdata-row'>
            <td class="mainTD">${number}       
              <input class='studentName-edit' value="${student.fullname}" placeholder="${lang(inputlabel)}" translate-label="${inputlabel}"/>
            </td>
            <td><input value="${student.uniqueCode}" class='input-data input-uniquecode'></td>
            <td><input value="${student.birthday}" class='input-data input-birthdate'></td>
            <td><input value="${student.parents}" class='input-data input-parnames'></td>
            <td><input value="${student.parentsphones}" class='input-data input-phones'></td>
            <td><input value="${student.jobs}" class='input-data input-jobs'></td>
          </tr>`;
}

function scheduleRowTemplate(row) {
  row = row || {
    subject: '',
    dateLesson: '',
    from: '',
    to: '',
  };
  return `<tr class='schedule-row'>
              <td class='tdSub'><input value="${row.subject}" class='subjectInput'></td>
              <td class='tdSub'><input value="${row.dateLesson}" class='dateInput'></td>
              <td class='tdGod'><input value="${row.from}" class='fromInput'></td>
              <td class='tdGod'><input value="${row.to}" class='toInput'></td>
          </tr>`;
}

function scheduleClassRowTemplate(data) {
  const days = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
  ];
  const defaultDayData = {
    subject: '',
    teacher: '',
  };
  const defaultRowData = {
    'mon': Object.assign({}, defaultDayData),
    'tue': Object.assign({}, defaultDayData),
    'wed': Object.assign({}, defaultDayData),
    'thu': Object.assign({}, defaultDayData),
    'fri': Object.assign({}, defaultDayData),
  };
  let defaultData = new Array(8);
  defaultData.fill(defaultRowData);
  data = data || defaultData;
  return `${data.map(row=>(
            `<tr class='schedule-class-row'>
              ${days.map(day=>(
                `<td class="${day}"><input type="text" value="${row[day].subject}" class='inputSubjectClass'></td>
                <td class="${day}"><input type="text" value="${row[day].teacher}" class='inputTeacherClass'></td>`)
              )}
            </tr>`)
          )}`;
}

function getStartPageTemplate(className, students, dates) {
  const style = 'border-bottom-color: lightsteelblue;';
  const translateLabel = 'label_students_table';
  const translateDateLessonsLabel = 'label_date_lessons';
  const translateClassLabel = 'label-class';
  dates = dates || [];
  className = className || '';
  students = students || '';
  return `<div class='one-page-wrapper'>       
            <table class='students'>
                <tr class='row'>
                    <th width="15%" translate-label='${translateLabel}' style="${style}">${lang(translateLabel)}</th>
                    <th colspan="15" translate-label='${translateDateLessonsLabel}'>${lang(translateDateLessonsLabel)}</th>
                </tr>
                <tr class='dates-row'>
                    <td class='blue-th'>
                      <input type="text" value="${className}" placeholder="${lang(translateClassLabel)}" class='input_class' translate-label='${translateClassLabel}'>
                    </td>
                    ${dates.map(key=>`<td class='date-field-wrapper'><label><input value="${key}" type="text" class='input_date'></label></td>`).join('')}
                    ${'<td class="date-field-wrapper"><label><input type="text" class="input_date"></label></td>'.repeat(15-dates.length)}
                </tr>
                ${students}
            </table>
        </div> `;
}

function getPageTwoTemplate(className, students, dates) {
  const style = 'border-bottom-color: lightsteelblue;';
  const translateLabel = 'label_students_table';
  const translateDateLessonsLabel = 'label_date_lessons';
  const translateClassLabel = 'label-class';
  dates = dates || [];
  className = className || '';
  students = students || '';
  return `<div class='one-page-wrapper'>       
            <table class='students'>
                <tr class='row'>
                    <th width="15%" translate-label='${translateLabel}' style="${style}">${lang(translateLabel)}</th>
                    <th colspan="15" translate-label='${translateDateLessonsLabel}'>${lang(translateDateLessonsLabel)}</th>
                </tr>
                <tr class='dates-row'>
                    <td class='blue-th'>
                      <input type="text" value="${className}" placeholder="${lang(translateClassLabel)}" class='input_class' translate-label='${translateClassLabel}'>
                    </td>
                    ${dates.map(key=>`<td class='date-field-wrapper'><label><input value="${key}" type="text" class='input_date'></label></td>`).join('')}
                    ${'<td class="date-field-wrapper"><label><input type="text" class="input_date"></label></td>'.repeat(15-dates.length)}
                </tr>
                ${students}
            </table>
        </div> `;
}

function getPageThreeTemplate(studentsRows = '') {
  const translateLabel = 'label_students_table';
  const dataLabel = 'label-person-data';
  const uniqueLabel = 'label-unique-code';
  const birthLabel = 'label-birth-date';
  const parentsLabel = 'label-parents-name';
  const phoneLabel = 'label-phone-numbers';
  const jobLabel = 'label-parents-job';
  return `<div class='one-page-wrapper'> 
            <table class='studentsdata'>
                <tr class='row'>
                    <th rowspan="2" width="15%" translate-label='${translateLabel}'>${lang(translateLabel)}</th>
                    <th colspan="5" translate-label='${dataLabel}'>${lang(dataLabel)}</th>
                </tr>
                <tr class='data-row'>
                    <th><label translate-label='${uniqueLabel}'>${lang(uniqueLabel)}</label></th>
                    <th><label translate-label='${birthLabel}'>${lang(birthLabel)}</label></th>
                    <th><label translate-label='${parentsLabel}'>${lang(parentsLabel)}</label></th>
                    <th><label translate-label='${phoneLabel}'>${lang(phoneLabel)}</label></th>
                    <th><label translate-label='${jobLabel}'>${lang(jobLabel)}</label></th>          
                </tr>
                ${studentsRows}
            </table>
        </div>`;
}

function getPageFourTemplate(daysRows) {
  const subjectLabel = 'label-subject';
  const dataLabel = 'label_date_lessons';
  const fromLabel = 'label-from-time';
  const toLabel = 'label-to-time';
  daysRows = daysRows || scheduleRowTemplate().repeat(10);
  return `<div class='lessons-table'>                                                                                          
             <table>
                <tr>
                    <th translate-label='${subjectLabel}'>${lang(subjectLabel)}</th>
                    <th translate-label='${dataLabel}'>${lang(dataLabel)}</th>
                    <th translate-label='${fromLabel}'>${lang(fromLabel)}</th>
                    <th translate-label='${toLabel}'>${lang(toLabel)}</th>
                </tr>  
                ${daysRows}          
            </table>
          </div>`;
}

function getPageSixTemplate(weekDate = '', subRows) {
  const holderTanslate = 'label-write-date';
  const monLabel = 'label-mon';
  const tueLabel = 'label-tue';
  const wenLabel = 'label-wen';
  const thuLabel = 'label-thu';
  const friLabel = 'label-fri';
  const subjectLabel = 'label-subject';
  const teacherLabel = 'label-teacher';
  subRows = subRows || scheduleClassRowTemplate();
  return `<table class='scheduleTable'>
             <tr class='row'>
                    <th colspan='10'><input class='input_th' value="${weekDate}" placeholder='${lang(holderTanslate)}' translate-label='${holderTanslate}'/></th>
                </tr>
             <tr class='row'>
                    <th colspan='2' translate-label='${monLabel}'>${lang(monLabel)}</th> 
                        
                    <th colspan='2' translate-label='${tueLabel}'>${lang(tueLabel)}</th> 
               
                    <th colspan='2' translate-label='${wenLabel}'>${lang(wenLabel)}</th> 
               
                    <th colspan='2' translate-label='${thuLabel}'>${lang(thuLabel)}</th> 
              
                    <th colspan='2' translate-label='${friLabel}'>${lang(friLabel)}</th> 
               </tr>
                <tr>
                  ${`<th translate-label='${subjectLabel}'>${lang(subjectLabel)}</th>
                    <th translate-label='${teacherLabel}'>${lang(teacherLabel)}</th>`.repeat(5)}
                </tr>              
                ${subRows}          
            </table>`;
}

function addStudent() {
  const addButtons = document.querySelectorAll('.addStudent');
  for (let i = 0; i < addButtons.length; i += 1) {
    addButtons[i].addEventListener('click', function () {
      let activePage = document.querySelector('.page-check-radio:checked + .page');
      const studentTable = activePage.querySelectorAll('.students tbody');
      const pages = activePage.querySelectorAll('.one-page-wrapper.active');
      const id = getNewId();
      for (let y=0; y< pages.length; y += 1) {
        let studentTable = pages[y].querySelector('.students tbody');
        if(studentTable){
          studentTable.insertAdjacentHTML('beforeEnd', oneStudentTempalte(studentTable.rows.length-1, id));
        }
      }
    }); 
  };
}  

function addStudentData() {
  const addButtons = document.querySelectorAll('.addStudentData');
  for (let x=0; x < addButtons.length; x += 1){
    addButtons[x].addEventListener('click', function(){
      let thisPage = document.querySelector('.page-check-radio:checked + .page');
      const studentDataTable = thisPage.querySelectorAll('.studentsdata tbody');
      const pages = thisPage.querySelectorAll('.one-page-wrapper.active');
      for (let n=0; n< pages.length; n+=1){
        let studentDataTable = pages[n].querySelector('.studentsdata tbody');
        studentDataTable.insertAdjacentHTML('beforeEnd', oneStudentDataTemplate(studentDataTable.rows.length-1));
      }
    });
  }
}

function addNewPage() {
  const addPageBtns = document.querySelectorAll('.addNewPage');
  [].forEach.call(addPageBtns, (addButton) => {
    addButton.addEventListener('click', function () {
      let activePage = document.querySelector('.page-check-radio:checked + .page');
      let pageContentWrapper = activePage.querySelector('.page-content-wrapper');
      let notActive = pageContentWrapper.querySelector('.one-page-wrapper.active');
      let newTemplate;
      notActive.classList.remove('active');
      if (activePage.id === 'start-page'){
        newTemplate = getElementFromText(getStartPageTemplate());
      };
      if (activePage.id === 'page-two'){
        newTemplate = getElementFromText(getPageTwoTemplate());
      };
      if (activePage.id === 'page-three'){
        newTemplate = getElementFromText(getPageThreeTemplate());
      };
      newTemplate.classList.add('active');
      pageContentWrapper.appendChild(newTemplate);     
      paginationUpdate(activePage);
    });
  });
}

function paginationUpdate(activePage) {
  const pagesContentWrapper = activePage.querySelector('.page-content-wrapper');
  let pages = pagesContentWrapper.children.length;
  let activeIndex = -1;
  let paginationWrapper = activePage.querySelector('.pagination-wrapper');
  let ul = paginationWrapper.querySelector('ul');
  [].some.call(pagesContentWrapper.children, (child, ind) => {
    let isActive = child.classList.contains('active');
    if (isActive) {
      activeIndex = ind;
    }
    return isActive;
  })
  if ( pages === 1) {
    paginationWrapper.classList.add('hide');
  } else {
    paginationWrapper.classList.remove('hide');
    ul.innerHTML = '';
    for(let i = 0; i < pages; i +=1 ) {
      ul.insertAdjacentHTML('beforeEnd', `<li class='page-link ${i===activeIndex?'active':''}' data-page-number='${i+1}'>${i+1}</li>`);
    }
    addPaginationHandler(activePage); 
  }
}

function addPaginationHandler(activePage) {
  let pageLinks = activePage.querySelectorAll('.page-link'); 
  [].forEach.call(pageLinks, (pageLink) => {
    pageLink.addEventListener('click', (event) => {
      const viewPage = document.querySelector('.page-check-radio:checked + .page');
      const currentTarget = event.currentTarget;
      const currentActiveLink = viewPage.querySelector('.page-link.active');
      const pageNumber = +currentTarget.dataset.pageNumber;
      const parent = currentTarget.closest('.page');
      const pageContent = parent.querySelector('.page-content-wrapper');
      [].forEach.call(pageContent.children, (onePageWrapper, index) => {
        if (index+1 === pageNumber) {
          onePageWrapper.classList.add('active');
        } else {
          onePageWrapper.classList.remove('active');
        }
      });
      currentActiveLink.classList.remove('active');
      currentTarget.classList.add('active');
    });
  });
}
  
function openPrevious() {
  const previousButton = document.getElementById('previousButton');
  const lessonsTableWrapper = document.getElementById('lessons-table-wrapper');
  previousButton.addEventListener('click', function () {
    let activeTable = lessonsTableWrapper.querySelector('.lessons-table.active');
    if(activeTable.previousElementSibling != null){
        activeTable.classList.remove('active');
        activeTable.previousElementSibling.classList.add('active');
    }    
  });  
}

function openNext() {
  const nextButton = document.getElementById('nextButton');
  const lessonsTableWrapper = document.getElementById('lessons-table-wrapper');
  let tables = lessonsTableWrapper.children.length;
  nextButton.addEventListener('click', function () {
    let activeTable = lessonsTableWrapper.querySelector('.lessons-table.active');
    if (activeTable.nextElementSibling === null) {
      let template = getElementFromText(getPageFourTemplate());
      //let childTemplate = template.cloneNode(true);
      activeTable.classList.remove('active');
      lessonsTableWrapper.appendChild(template);
    };
    if (activeTable.nextElementSibling != null) {
        activeTable.classList.remove('active');
        activeTable.nextElementSibling.classList.add('active');        
    };           
  });
}

const addNewNote = (activePage, tmplt) => {
  activePage.insertAdjacentHTML('beforeend', tmplt);
}

const noteTemplate = (id, note = '') => {
  const labelName = 'label-note-content';
  return `<textarea class="note" cols="35" wrap="hard" placeholder="${lang(labelName)}" translate-label='${labelName}' data-noteid=${'note-'+id}>${note}</textarea>`;
};

function addNotes() {
  const addNotesButton = document.getElementById('plus');
  const activePage = document.getElementById('page-five');
  addNotesButton.addEventListener('click', (event) => {
    addNewNote(activePage, noteTemplate(Date.now()));
  });
  if (!activePage.querySelector('.note')) {
    addNewNote(activePage, noteTemplate(Date.now()));
  }
}

function addNewWeek(){
  let addWeekBtn = document.getElementById("NewWeek"); 
  addWeekBtn.addEventListener('click', () => {
    addWeekBtn.insertAdjacentHTML('beforebegin', getPageSixTemplate());
  });
}

// bunch of functions with Data to restore

function saveData() {
  let data = {
    boards:{},
  };
  const boards = document.querySelectorAll('.page');
  [].forEach.call(boards, (board) => {
    const pages = board.querySelectorAll('.page-content-wrapper .one-page-wrapper');
    let boardData = [];
    [].forEach.call(pages, (page, index) => {
      let pageData = {
        pageId: index+1,
        students: [],
        className: ((page.querySelector('.input_class') && page.querySelector('.input_class').value) || ''),
      };
      if(board.querySelector('.titleInput')) {
        pageData['subjectName'] =  board.querySelector('.titleInput').value || '';  
      }
      let datesArr = page.querySelectorAll('.dates-row .date-field-wrapper');
      // save students on each page
      [].forEach.call(page.querySelectorAll('.students .students-row'), (row)=> {
        let student = {
          id: row.dataset.studentId,
        };
        student.fullname = row.querySelector('.studentName-edit').value;
        let marks = row.querySelectorAll('.input_ocena');
        student.marks = [].reduce.call(marks, (acc, input, index) => {
          const key = datesArr[index] && datesArr[index].querySelector('.input_date').value;
          if (key && input.value) {
            acc[key] = input.value;
          }          
          return acc;
        }, {});
        pageData.students.push(student);
      });
      /*if(board.querySelector('.titleInput-class')){
          pageData['class'] =  board.querySelector('.titleInput-class').value || '';
      }*/
      // studentstudent from page 3
      [].forEach.call(page.querySelectorAll('.studentsdata .studentsdata-row'), (row) => {
        let studentdata = {
          'fullname': row.querySelector('.studentName-edit').value,
          'uniqueCode': row.querySelector('.input-data.input-uniquecode').value,
          'birthday': row.querySelector('.input-data.input-birthdate').value,
          'parents': row.querySelector('.input-data.input-parnames').value,
          'parentsphones': row.querySelector('.input-data.input-phones').value,
          'jobs': row.querySelector('.input-data.input-jobs').value,
        };
        pageData.students.push(studentdata);
      });
      boardData.push(pageData);
    });
    // handler for page 4
    const tables = board.querySelectorAll('.lessons-table');
    [].forEach.call(tables, (table) => {
      let tableContent = [];
      [].forEach.call(table.querySelectorAll('.schedule-row'), (row) => {
        let tableData = {
          'subject': row.querySelector('.subjectInput').value,
          'dateLesson': row.querySelector('.dateInput').value,
          'from': row.querySelector('.fromInput').value,
          'to': row.querySelector('.toInput').value,
        };
        
        tableContent.push(tableData);
      });
      boardData.push(tableContent);
    });
    // handler for page 5
    let notesContent = [];
    [].forEach.call(board.querySelectorAll('.note'), (note)=> {     
      let noteValue = { 
        'noteContent': note.value,
      }
      notesContent.push(noteValue);
    });    
    if (notesContent.length) {
      boardData = notesContent;
    }
    // handler for page 6
    const scheduleTables = board.querySelectorAll('.scheduleTable');
    const getOneDay = (row, day) => {
      return {
        'subject': (row.querySelector(`.${day} .inputSubjectClass`).value || '-'),
        'teacher': (row.querySelector(`.${day} .inputTeacherClass`).value || '-'),
      }
    }
    [].forEach.call(scheduleTables, (table, index) => {
      let scheduleClass = {
        'schedule': index,
        'weekDate': ((table.querySelector('.input_th') && table.querySelector('.input_th').value) || ''),
        'data': [],
      };
      [].forEach.call(table.querySelectorAll('.schedule-class-row'), (row) => {
        let oneDay = ['mon', 'tue', 'wed', 'thu', 'fri'].reduce((acc, day)=>{acc[day] = getOneDay(row, day); return acc}, {});
        scheduleClass['data'].push(oneDay);
      })
      
      boardData.push(scheduleClass);
    });

    // saving
    data.boards[board.id] = boardData;
  });
  
  localStorage.setItem('data', JSON.stringify(data));
}

function restoreData() {
  let data = localStorage.getItem('data') || '{}';
  data = JSON.parse(data);
  const startPageWrapper = document.querySelector('#start-page');
  if (!data.boards) {
    return;
  }
  data.boards['start-page'].forEach((pageData)=>{
    //create one page inside of start-page container
    if (pageData['subjectName']) {
      const titleInput = startPageWrapper.querySelector('.titleInput');
      titleInput && (titleInput.value = pageData['subjectName']);
    }
    if (pageData.pageId === 1) {
      let mainDates = ((pageData.students[0] && Object.keys(pageData.students[0].marks)) || []);
      let firstPageStudentsContainer = startPageWrapper.querySelector('.page-content-wrapper .one-page-wrapper .students tbody');
      let dateFields = firstPageStudentsContainer.querySelectorAll('.dates-row .date-field-wrapper .input_date');
      startPageWrapper.querySelector('.input_class').value = pageData.className;
      mainDates.forEach((date, dateIndex)=> {
        if (dateFields[dateIndex]) {
          dateFields[dateIndex].value = date;
        }
      });
      pageData.students.forEach((studentDataRow, index)=>{
        const templateToInsert = oneStudentTempalte((index+1), studentDataRow.id, studentDataRow.fullname, studentDataRow.marks);
        firstPageStudentsContainer.insertAdjacentHTML('beforeEnd', templateToInsert);
      });
    } else {
      let mainDates = ((pageData.students[0] && Object.keys(pageData.students[0].marks)) || []);
      let studentsRows = pageData.students.reduce((template, studentDataRow, index)=>{
        const templateToInsert = oneStudentTempalte((index+1), studentDataRow.id, studentDataRow.fullname, studentDataRow.marks);
        return template + templateToInsert;
      }, '');
      let newPageTemplate = getStartPageTemplate((pageData.className||'') , studentsRows, mainDates);
      startPageWrapper.querySelector('.page-content-wrapper').insertAdjacentHTML('beforeEnd', newPageTemplate);
    }
  });

  paginationUpdate(startPageWrapper);
  // page two
  const pageTwoWrapper = document.querySelector('#page-two');
  data.boards['page-two'].forEach((pageData)=>{
    //create one page inside of two-page container
    if (pageData['subjectName']) {
      const titleInput = pageTwoWrapper.querySelector('.titleInput');
      titleInput && (titleInput.value = pageData['subjectName']);
    }
    if (pageData.pageId === 1) {
      let mainDates = ((pageData.students[0] && Object.keys(pageData.students[0].marks)) || []);
      let twoPageStudentsContainer = pageTwoWrapper.querySelector('.page-content-wrapper .one-page-wrapper .students tbody');
      let dateFields = twoPageStudentsContainer.querySelectorAll('.dates-row .date-field-wrapper .input_date');
      pageTwoWrapper.querySelector('.input_class').value = pageData.className;
      mainDates.forEach((date, dateIndex)=> {
        if (dateFields[dateIndex]) {
          dateFields[dateIndex].value = date;
        }
      });
      pageData.students.forEach((studentDataRow, index)=>{
        const templateToInsert = oneStudentTempalte((index+1), studentDataRow.id, studentDataRow.fullname, studentDataRow.marks);
        twoPageStudentsContainer.insertAdjacentHTML('beforeEnd', templateToInsert);
      });
    } else {
    let mainDates = ((pageData.students[0] && Object.keys(pageData.students[0].marks)) || []);
    let studentsRows = pageData.students.reduce((template, studentDataRow, index)=>{
      const templateToInsert = oneStudentTempalte((index+1), studentDataRow.id, studentDataRow.fullname, studentDataRow.marks);
      return template + templateToInsert;
    }, '');
    let newPageTemplate = getPageTwoTemplate((pageData.className||'') , studentsRows, mainDates);
    pageTwoWrapper.querySelector('.page-content-wrapper').insertAdjacentHTML('beforeEnd', newPageTemplate);
    }
  });

  paginationUpdate(pageTwoWrapper);

  //page three
  const pageThreeWrapper = document.querySelector('#page-three');
  data.boards['page-three'].forEach((pageData)=>{
    //create one page inside of three-page container
    if (pageData['class']) {
      const titleInput = pageThreeWrapper.querySelector('.titleInput-class');
      titleInput && (titleInput.value = pageData['class']);
    }
    if (pageData.pageId === 1) {
      let threePageStudentsContainer = pageThreeWrapper.querySelector('.page-content-wrapper .one-page-wrapper .studentsdata tbody');
      pageData.students.forEach((studentData, index)=>{
        const templateToInsert = oneStudentDataTemplate((index+1), studentData);
        threePageStudentsContainer.insertAdjacentHTML('beforeEnd', templateToInsert);
      });
    } else {
      let studentsRows = pageData.students.reduce((template, studentData, index)=>{
        const templateToInsert = oneStudentDataTemplate((index+1), studentData);
        return template + templateToInsert;
      }, '');
      let newPageTemplate = getPageThreeTemplate(studentsRows);
      pageThreeWrapper.querySelector('.page-content-wrapper').insertAdjacentHTML('beforeEnd', newPageTemplate);
    }
  });

  paginationUpdate(pageThreeWrapper);
  //page four
  const pageFourWrapper = document.querySelector('#page-four');
  const lessonsTableWrapper = pageFourWrapper.querySelector('#lessons-table-wrapper');
  data.boards['page-four'].forEach((lessonsArray, index)=> {
    //create table 
    if (index === 0) {
      let lessonsContainer = lessonsTableWrapper.children[0];
      let rows = lessonsContainer.querySelectorAll('.schedule-row');
      [].forEach.call(rows, (row, ind) => {
        if (lessonsArray[ind]) {
          row.querySelector('.subjectInput').value = lessonsArray[ind]['subject'];
          row.querySelector('.dateInput').value = lessonsArray[ind]['dateLesson'];
          row.querySelector('.fromInput').value = lessonsArray[ind]['from'];
          row.querySelector('.toInput').value = lessonsArray[ind]['to'];
        }
      });
    } else {
      let lessonsRows = lessonsArray.reduce((template, row)=>{
        const templateToInsert = scheduleRowTemplate(row); 
        return template + templateToInsert;
      }, '');
      
      lessonsTableWrapper.insertAdjacentHTML('beforeEnd', getPageFourTemplate(lessonsRows));
    }
  });
  //page five
  const pageFiveHeader = document.querySelector('#page-five .page-header');
  data.boards['page-five'].reverse().forEach((oneNote) => {
    pageFiveHeader.insertAdjacentHTML('afterEnd', noteTemplate(oneNote.id, oneNote.noteContent));
  });
  //page six
  const scheduleTableWrapper = document.querySelector('#page-six .tableWrapper');
  data.boards['page-six'].forEach((table, index) => {
    if (index === 0) {
      let scheduleContainer = scheduleTableWrapper.children[0];
      let classRows = scheduleContainer.querySelectorAll('.schedule-class-row');
      if (table['weekDate']) {
        scheduleContainer.querySelector('.input_th').value = table['weekDate'];
      }
      [].forEach.call(classRows, (classRow, rowIndex)=> {
        let data = table.data[rowIndex] || null;
        if (data) {
          let days = Object.keys(data);
          days.forEach((day)=>{
            classRow.querySelector(`.${day} .inputSubjectClass`).value = data[day]['subject']; // '.' + day + ' .inputSubjectClass'
            classRow.querySelector(`.${day} .inputTeacherClass`).value = data[day]['teacher'];
          });
        }
      });
    } else {
      let subRows = scheduleClassRowTemplate(table.data);
      scheduleTableWrapper.insertAdjacentHTML('beforeEnd', getPageSixTemplate(table['weekDate'], subRows));
    }
  });
}  

let currentLanguage = localStorage.getItem('lang') || 'pl';
function languageChangeHandler(event) {
  currentLanguage = this.value;
  localStorage.setItem('lang', currentLanguage);
  lang.defaultLocale = currentLanguage;
  setTranslate();
}

function lang(str, locale) {
  locale = locale || lang.defaultLocale;
  if (lang.data.hasOwnProperty(locale) && typeof lang.data[locale] == 'object') {
    if (lang.data[locale].hasOwnProperty(str)) {
      return lang.data[locale][str];
    }
  }
  return str;
}

lang.defaultLocale = currentLanguage;
lang.data = {
  pl: {
      'label-app-title': 'Czasopismo nauczyciela',
      'label-menu': 'Menu',
      'label_date_lessons': 'Data zajęć',
      'label_marks_list': 'Lista ocen',
      'label_presence_list': 'Lista obecności',
      'label_information_list': 'Informacja o uczniach',
      'label_schedule': 'Podział godzin',
      'label_notes': 'Notatniki',
      'label_schedule_class': 'Podział godzin klasy',
      'label_students_table': 'Lista uczniów',
      'studentNameFieldPlaceholder': 'Imię i nazwisko',
      'label-subject-name': 'Nazwa przedmiotu',
      'label-new-page': 'Nowa strona',
      'label-add-student': 'Dodać ucznia',
      'label-from-time': 'Od',
      'label-to-time': 'Do',
      'label-class': 'Klasa',
      'label-person-data': 'Dane osobowe',
      'label-unique-code': 'PESEL',
      'label-birth-date': 'Data urodzenia',
      'label-parents-name': 'Imiona rodziców',
      'label-phone-numbers': 'Numery telefonów rodziców',
      'label-parents-job': 'Miejsca pracy rodziców',
      'label-subject': 'Przedmiot',
      'label-previous': 'Poprzedni',
      'label-next': 'Następny',
      'label-notatniki': 'Notatniki',
      'label-note-content': 'Napisz coś...',
      'label-mon': 'Poniedziałek',
      'label-tue': 'Wtorek',
      'label-wen': 'Środa',
      'label-thu': 'Czwartek',
      'label-fri': 'Piątek',
      'label-teacher': 'Nauczyciel',
      'label-add-week': 'Dodać tydzień',
      'label-write-date': 'Wpisz datę'          
    },
  ua: {
      'label-app-title': 'Журнал вчителя',
      'label-menu': 'Меню',
      'label_date_lessons': 'Дата уроків',
      'label_marks_list': 'Список оцінок',
      'label_presence_list': 'Відвідуваність',
      'label_information_list': 'Інформація про учнів',
      'label_schedule': 'Розклад уроків',
      'label_notes': 'Нотатки',
      'label_schedule_class': 'Розклад уроків для класу',
      'label_students_table': 'Список учнів',
      'studentNameFieldPlaceholder': "Ім'я та прізвище",
      'label-subject-name': 'Назва предмету',
      'label-new-page': 'Нова сторінка',
      'label-add-student': 'Додати учня',
      'label-from-time': 'Від',
      'label-to-time': 'До',
      'label-class': 'Клас',
      'label-person-data': 'Особисті дані',
      'label-unique-code': 'Ідентифікаційний номер',
      'label-birth-date': 'Дата народження',
      'label-parents-name': 'Імена батьків',
      'label-phone-numbers': 'Номери телефонів батьків',
      'label-parents-job': 'Місця праці батьків',
      'label-subject': 'Предмет',
      'label-previous': 'Попередній',
      'label-next': 'Наступний',
      'label-notatniki': 'Нотатки',
      'label-note-content': 'Напишіть щось...',
      'label-mon': 'Понеділок',
      'label-tue': 'Вівторок',
      'label-wen': 'Середа',
      'label-thu': 'Четвер',
      'label-fri': "П'ятниця",
      'label-teacher': 'Вчитель',
      'label-add-week': 'Додати тиждень',
      'label-write-date': 'Впишіть дату'
    }    
};

function setTranslate() {
  const translatedItems = document.querySelectorAll('[translate-label]');
  [].forEach.call(translatedItems, (item) => {
    const labelName = item.getAttribute('translate-label');
    if( item.nodeName === 'INPUT' || item.nodeName === 'TEXTAREA' ) {
      item.placeholder = lang(labelName);
    } else {
       item.textContent = lang(labelName);
    }
  });
}

function addEventHandlers() {
  const languageSwitcher = document.querySelector('#language-switcher');
  languageSwitcher.addEventListener('change', languageChangeHandler);
  document.addEventListener('change', () => {
    saveData();
  });
}

function init() {
  updateTitle();
  addStudent();
  addStudentData();
  addNewPage();
  openPrevious();
  openNext();
  
  addNewWeek();
  setTranslate();
  restoreData();
  addNotes();
  addEventHandlers();
}

window.onload = init;