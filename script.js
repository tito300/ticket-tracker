const priorities = [     'medium',  'high',     'medium', 'low']
const prioritiesColor = ['#e2b043', '#e84545', '#e2b043', '#bbbbbb']

const envs = [      '20test', '20test',  '20qa',    'staging', 'none']
const envsColors = ['#2c34bc', '#2c34bc', '#a84bac', '#fd7e14', 'gray']

const view = (function() {
    const priorityDropDownBtn = document.getElementById('dropdownMenuButton');
    const priorityDropDownDiv = document.getElementById('dropdownMenu');
    const envDropDownBtn = document.getElementById('dropdownMenuButtonEnv');
    const envDropDownDiv = document.getElementById('dropdownMenuEnv');
    const inputswrapper = document.getElementById('inputswrapper');
    const ticketInput = document.getElementById('ticketInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const tasksListContainerDiv = document.getElementById('tasksContainer');

    document.querySelector('body').addEventListener('click', globalClickController)

    return {
        priorityDropDownBtn,
        priorityDropDownDiv,
        ticketInput,
        tasksListContainerDiv,
        descriptionInput,
        inputswrapper,
        envDropDownBtn,
        envDropDownDiv
    }
})();

const defaultCurrentTicket =  {
    priority: 0, // medium by default
    description: '',
    env: 0,
    current: false,
    deployed: false,
   }

const TasksList = {
   list: getInitialList(),
   currentTicket: {
       ...defaultCurrentTicket,
   },
   defaultCurrentTicket: {
    ...defaultCurrentTicket,
   },
   
   addItem(value, description) {
    this.currentTicket.id = Math.ceil(Math.random() * 10000);
    this.currentTicket.ticketNum = value;
    this.currentTicket.description = description;
    this.currentTicket.current = false;
    this.currentTicket.completed = false;
    this.currentTicket.deployed = false;
    let newList = [];

    if(this.list.length > 0) {
        newList = [...this.list]
    }

    // filtering due to a bug that add undefine to array with each item - should fix
    newList = newList.filter(item => typeof item === 'object');

    newList.push(this.currentTicket);

    this.list = [...newList]

    this.currentTicket = {
        ...defaultCurrentTicket,
    },

    this.renderTasksList();
   },
   removeItem(id) {
        TasksList.list = TasksList.list.filter(task => task.id !== parseInt(id));

        TasksList.renderTasksList();
   },
   updateItem(newItem) {

   },
   markCurrent(id) {
    TasksList.list.forEach(task => {
        if(task.id === parseInt(id) && !task.completed) {
            task.current = !task.current;
        }
    });

    TasksList.renderTasksList();
   },
   renderTasksList() {
    const ul = createElement('ul', 'list-group mb-4');
    const ulCompleted = createElement('ul', 'list-group mb-4');
    const ulDeployed = createElement('ul', 'list-group', null);
    

    this.list.sort((a, b) => a.priority - b.priority);

    let otherTickets = this.list.filter(i => !i.current && !i.deployed && !i.completed);
    let currentTickets = this.list.filter(i => i.current && !i.completed);
    let completedTickets = this.list.filter(i => i.completed && !i.deployed);
    let deployedTickets = this.list.filter(i => i.deployed && i.completed);

    this.list = [...currentTickets, ...otherTickets, ...completedTickets, ...deployedTickets];

    this.list.forEach(task => {
        if(typeof task === 'object') {
            const li = createElement('li', `list-group-item d-flex justify-content-between align-items-center tasks-list__item--${task.priority}`);
            const leftContainerSpan = document.createElement('span');
            const rightContainerSpan = document.createElement('span');
            const envBadgeSpan = document.createElement('span');
            const deleteSvg = document.createElement('span');

            leftContainerSpan.textContent = `${task.ticketNum} ${task.description ? ' - ' + task.description : ''}`;
            leftContainerSpan.className = 'd-flex align-items-center';
            
            rightContainerSpan.className = 'd-flex align-items-center'; 
            
            const priorBadge = document.createElement('span');
            priorBadge.style.display = 'inline-block'
            priorBadge.style.backgroundColor = `${prioritiesColor[task.priority]}`;
            priorBadge.className = 'badge badge-primary badge-pill py-1 mr-3';
            priorBadge.textContent = priorities[task.priority];
            
            envBadgeSpan.className = 'badge badge-primary mr-3 py-2 rounded-0';
            envBadgeSpan.style.backgroundColor = `${envsColors[task.env]}`;
            envBadgeSpan.style.cursor = `pointer`;
            envBadgeSpan.id = `envBadge`;
            envBadgeSpan.dataset.id = task.id;
            envBadgeSpan.textContent = envs[task.env];
            if(task.current) {
                const statusSvg = document.createElement('span');
                
                if(task.completed) {

                    if(task.deployed) {
                        li.style.opacity = 0.5;
                        statusSvg.className = 'paper-plane--deployed'
                        envBadgeSpan.style.border = '3px solid green';
                        statusSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                        <g><path d="M776.7,350.4c-54.2-104.6-163.3-176-289.2-176c-148.7,0-274.1,99.7-313,235.8C80.4,431.1,10,515,10,615.3c0,116,94.1,210.1,210.1,210.1h189.6V552.5h-75.9c-5,0-9.5-2.9-11.6-7.4s-1.5-9.8,1.7-13.7l166.1-200.3c2.4-2.9,6.1-4.6,9.9-4.6c3.8,0,7.5,1.7,9.9,4.6l165.6,199.6c2.2,2.3,3.5,5.4,3.5,8.8c0,7.1-5.7,12.9-12.9,12.9c0,0,0,0-0.1,0h-75.9v273.1h161.6c131.6,0,238.2-106.6,238.2-238.2C989.9,464.2,896.6,362.9,776.7,350.4z"/></g>
                        </svg>`
                        statusSvg.addEventListener('click', () => {
                            TasksList.resetStatus(task.id);
                        })
                        li.addEventListener('mouseover', function() {
                            this.style.opacity = 1;
                        })
                        li.addEventListener('mouseout', function() {
                            this.style.opacity = 0.5;
                        })
                    } else {
                        statusSvg.className = 'paper-plane--completed'
                        envBadgeSpan.style.border = '3px solid green';
                        statusSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 3 16 16"><defs><linearGradient gradientUnits="userSpaceOnUse" y2="-2.623" x2="0" y1="986.67" id="0"><stop stop-color="#ffce3b"/><stop offset="1" stop-color="#ffd762"/></linearGradient><linearGradient y2="-2.623" x2="0" y1="986.67" gradientUnits="userSpaceOnUse"><stop stop-color="#ffce3b"/><stop offset="1" stop-color="#fef4ab"/></linearGradient></defs><g transform="matrix(1.99997 0 0 1.99997-10.994-2071.68)" fill="#da4453"><rect y="1037.36" x="7" height="8" width="8" fill="#71a35b" rx="4"/><path d="m123.86 12.966l-11.08-11.08c-1.52-1.521-3.368-2.281-5.54-2.281-2.173 0-4.02.76-5.541 2.281l-53.45 53.53-23.953-24.04c-1.521-1.521-3.368-2.281-5.54-2.281-2.173 0-4.02.76-5.541 2.281l-11.08 11.08c-1.521 1.521-2.281 3.368-2.281 5.541 0 2.172.76 4.02 2.281 5.54l29.493 29.493 11.08 11.08c1.52 1.521 3.367 2.281 5.54 2.281 2.172 0 4.02-.761 5.54-2.281l11.08-11.08 58.986-58.986c1.52-1.521 2.281-3.368 2.281-5.541.0001-2.172-.761-4.02-2.281-5.54" fill="#fff" transform="matrix(.0436 0 0 .0436 8.177 1039.72)" stroke="none" stroke-width="9.512"/></g></svg>`
                        statusSvg.addEventListener('click', () => {
                            TasksList.markDeployed(task.id);
                        })
                    }
                } else {
                    statusSvg.className = 'paper-plane'
                    statusSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 486.736 486.736" style="enable-background:new 0 0 486.736 486.736;" xml:space="preserve"><g>
                        <path d="M481.883,61.238l-474.3,171.4c-8.8,3.2-10.3,15-2.6,20.2l70.9,48.4l321.8-169.7l-272.4,203.4v82.4c0,5.6,6.3,9,11,5.9   l60-39.8l59.1,40.3c5.4,3.7,12.8,2.1,16.3-3.5l214.5-353.7C487.983,63.638,485.083,60.038,481.883,61.238z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`;
                    envBadgeSpan.style.border = '3px solid red';
                    statusSvg.addEventListener('click', () => {
                        TasksList.markCompleted(task.id);
                    })
                }
                envBadgeSpan.append(statusSvg);

            }

            deleteSvg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="10pt" viewBox="-40 0 427 427.00131" width="10pt"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/></svg>'
            deleteSvg.className = 'delete-icon';
            deleteSvg.dataset.id = task.id;
            deleteSvg.id = 'deleteIcon';

            leftContainerSpan.prepend(envBadgeSpan);
            rightContainerSpan.append(deleteSvg)
            rightContainerSpan.prepend(priorBadge)
            li.prepend(leftContainerSpan);
            li.append(rightContainerSpan);
            if(task.completed) {
                if(task.deployed) {
                    ulDeployed.appendChild(li)
                } else {
                    ulCompleted.appendChild(li);
                }
            } else {
                ul.appendChild(li);
            }
        } 
    })
    const queueTitle = createElement('p', 'lead mb-1', 'Queue', {styles: [['fontWeight', '400'], ['color', 'rgba(0,0,0,0.6)']]});
    const completedTitle = createElement('p', 'lead mb-1', 'Ready for Deployment',  {styles: [['fontWeight', '400'], ['color', 'rgba(0,0,0,0.6)']]});
    const deployedTitle = createElement('p', 'lead mb-1', 'Deployed',  {styles: [['fontWeight', '400'], ['color', 'rgba(0,0,0,0.6)']]});
    const ulPlaceholder = createElement('ul', 'list-group mb-4')
    ulPlaceholder.appendChild(createElement('li', 'list-group-item text-muted', 'No tickets available..'))

    /* Reset previous elements */
    view.tasksListContainerDiv.innerHTML = '';

    /* QUEUE LIST */
    view.tasksListContainerDiv.appendChild(queueTitle);
    if(otherTickets.length || currentTickets.length) {
        view.tasksListContainerDiv.appendChild(ul);
    } else {
        view.tasksListContainerDiv.appendChild(ulPlaceholder);
    }

    /* COMPLETED LIST */
    view.tasksListContainerDiv.appendChild(completedTitle);
    if(completedTickets.length) {
        view.tasksListContainerDiv.appendChild(ulCompleted);
    } else {
        view.tasksListContainerDiv.appendChild(ulPlaceholder.cloneNode(true));
    }

    /* DEPLOYED LIST */
    view.tasksListContainerDiv.appendChild(deployedTitle);
    if(deployedTickets.length) {
        view.tasksListContainerDiv.appendChild(ulDeployed);
    } else {
        view.tasksListContainerDiv.appendChild(ulPlaceholder.cloneNode(true));
    }

    /* PAGE META */
    if(completedTickets.length) {
        document.getElementsByTagName('title')[0].textContent = `(${completedTickets.length}) Ready - (${otherTickets.length + currentTickets.length}) in Queue`
    } else {
        document.getElementsByTagName('title')[0].textContent = `Tracker`
    }

    TasksList.displayText({toggleHidden: false})
    localStorage.setItem('timestamp', JSON.stringify(new Date));
    localStorage.setItem('list', JSON.stringify(TasksList.list));
   },
   displayText(options) {
    let a = document.createElement("a");
    let textDisplayElement = document.getElementById("textDisplay");

    let text = generateExportTxt();
    textDisplayElement.innerText = text;
    if(options.toggleHidden) {
        textDisplayElement.hidden = !textDisplayElement.hidden;
    }
    // envokeExport(text, 'todays-work.txt');

        function envokeExport(text, fileName) {
            blob = new Blob([text], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };

        function generateExportTxt() {
            let text = '';

            TasksList.list.forEach((task, i) => {
                if (task.deployed) {
                    if(task.deploymentTimestamp && dateLessThan(new Date(task.deploymentTimestamp), 10)) {
                        text += '[' + task.ticketNum + '] ' + task.description + '\r\n'; 
                    }
                } else if(task.current || task.completed) {
                            text += '[' + task.ticketNum + '] ' + task.description + '\r\n'; 
                }
            })

            return text;
        }
   },
   markCompleted(id) {
       TasksList.list.forEach(task => {
           if(task.id === id) {
               task.completed = !task.completed;
           }
       })

       TasksList.renderTasksList();
   },
   markDeployed(id) {
        TasksList.list.forEach(task => {
            if(task.id === id) {
                task.deployed = true;
                task.deploymentTimestamp = new Date();
            }
        })

        TasksList.renderTasksList();
   },
   resetStatus(id) {
        TasksList.list.forEach(task => {
            if(task.id === id) {
                task.deployed = false;
                task.completed = false;
                task.deploymentTimestamp = null;
            }
        })

        TasksList.renderTasksList();
   }
}

TasksList.renderTasksList();

/* START PRIORITY DROPDOWN */
view.priorityDropDownBtn.addEventListener('click', () => {
    const styles = getComputedStyle(view.priorityDropDownDiv);
    view.priorityDropDownDiv.style.display = styles.display === 'none' ? 'block' : 'none';
})

view.priorityDropDownDiv.addEventListener('click', (e) => {
    if(e.target.className.includes('dropdown-item')) {
        TasksList.currentTicket.priority = parseInt(e.target.dataset.value);
        view.priorityDropDownBtn.textContent = priorities[TasksList.currentTicket.priority]

        view.priorityDropDownDiv.style.display = 'none';
    }
})

// view.priorityDropDownBtn.onblur = function() {
//     view.priorityDropDownDiv.style.display = 'none';
// }
/* END PRIORITY DROPDOWN */

/* START ENV DROPDOWN */
view.envDropDownBtn.addEventListener('click', () => {
    const styles = getComputedStyle(view.envDropDownDiv);
    view.envDropDownDiv.style.display = styles.display === 'none' ? 'block' : 'none';
})

view.envDropDownDiv.addEventListener('click', (e) => {
    if(e.target.className.includes('dropdown-item')) {
        TasksList.currentTicket.env = parseInt(e.target.dataset.value);
        view.envDropDownBtn.textContent = envs[TasksList.currentTicket.env]

        view.envDropDownDiv.style.display = 'none';
    }
})

// view.envDropDownBtn.onblur = function(e) {
//     setTimeout(() => {
//         view.envDropDownDiv.style.display = 'none';
//     }, 50)
// }
/* ENV PRIORITY DROPDOWN */



view.inputswrapper.addEventListener('keypress', e => {
    if(e.key === 'Enter') {
        if(!view.ticketInput.value) {
            view.ticketInput.style.backgroundColor = '#ffcccc';    
            return
        }

        TasksList.addItem(view.ticketInput.value, view.descriptionInput.value);
        view.ticketInput.blur();
        view.ticketInput.value = '';
        view.descriptionInput.value = '';
    } else {
        view.ticketInput.style.backgroundColor = '#fff';    
    }
})

function globalClickController(e) {
    if(e.target.parentElement.id === 'deleteIcon') {
        e.stopPropagation();
        TasksList.removeItem(e.target.parentElement.dataset.id);
    } 

    if(e.target.id === 'envBadge') {
        e.stopPropagation();
        TasksList.markCurrent(e.target.dataset.id);
    }
    
    if(e.target.id === 'exportBtn') {
        e.stopPropagation();
        TasksList.displayText({toggleHidden: true})
    }
}


function getInitialList() {
    let timestamp = JSON.parse(localStorage.getItem('timestamp'));
    let twelveHours = 60 * 60 * 12 * 1000;

        // if((new Date).getTime() - new Date(timestamp).getTime() < twelveHours) {
            return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
    //     } else {
    //         return [];
    //     }
}

function createElement(name, className, content, options) {
    if(!options) options = {};

    let el = document.createElement(name);
    el.className = className;
    if(content && typeof content === 'string' && content.includes('<')) {
        el.innerHTML = content;
    } else {
        el.textContent = content;
    }

    if(options.styles) {
        options.styles.forEach(style => {
            el.style[style[0]] = style[1];
        })
    }
    return el;
}

function dateLessThan(date, hours) {
    hours = hours * 60 * 60 * 1000;

    return ((new Date()) - date) < hours
}