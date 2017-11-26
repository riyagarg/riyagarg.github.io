
function normalizeInputData(data) {
    const parentNodes  = Object.keys(data);
    const childrenNode = {};
    const empData = {};
    for(let i = 0; i<parentNodes.length;i++){
      let queue = [];
      empData[parentNodes[i]] = {
      "employee_id": data[parentNodes[i]]["employee_id"],
      "name":data[parentNodes[i]]["name"],
      "designation":data[parentNodes[i]]["designation"],
      "team-name":data[parentNodes[i]]["team-name"],
      "show":false,
      }
      queue = queue.concat(data[parentNodes[i]].children);
      let parentKey  = parentNodes[i];
      childrenNode[parentKey] = data[parentNodes[i]].children.map(details=>({parentId: parentKey,id: details["employee_id"]}));
      while (queue.length > 0){
        const temp = queue.shift();
        if(temp){
          if(temp.children.length>0){
            queue = queue.concat(temp.children);
            childrenNode[temp["employee_id"]]= temp.children.map(details=>({parentId: temp["employee_id"],id: details["employee_id"]}))
          }
          empData[temp["employee_id"]] = {
            "employee_id": temp["employee_id"],
            "name":temp["name"],
            "designation":temp["designation"],
            "team-name":temp["team-name"],
            "show":false,
          };
        }
      }
    }
    return{ parentNodes, childrenNode, empData };
}


function createTree(data){
  this.parentNodes = [];
  this.childrenNode = {};
  this.empData = {};

  this.createCard = function(details){
    const card = document.createElement('div');
    card.setAttribute('id',details["employee_id"]);
    card.setAttribute('style',"margin: 10px; height:auto; width: auto; border: 1px solid grey; border-radius:2px; text-align:center; display:inline-block; vertical-align:top");

    const header = document.createElement('div');
    header.setAttribute('id',`teamName${details['employee_id']}`);
    header.innerHTML = details['team-name'];
    header.setAttribute('style',"background:#009999 ; height:auto; color:white; border-bottom: 1px solid #009999; font-size:13px; padding:5px ");

    const centerDiv = document.createElement('div');
    centerDiv.setAttribute('id',`employeeData${details['employee_id']}`);
    centerDiv.setAttribute('style',"diaplay:inline; margin:10px; font-size:11px; text-align:center; border-bottom: 1px solid grey ");


    const employeeName =document.createElement('div');
    employeeName.setAttribute('id',`employeeName${details['employee_id']}`);
    employeeName.innerHTML = details['name'];

    const empDesignation=document.createElement('div');
    empDesignation.setAttribute('id',`empDesignation${details['employee_id']}`);
    empDesignation.innerHTML = details['designation'];

    centerDiv.appendChild(employeeName);
    centerDiv.appendChild(empDesignation);

    const bottomDiv =  document.createElement('div');
    bottomDiv.setAttribute('id',`childrenData${details['employee_id']}`);
    bottomDiv.setAttribute('style',"diaplay:inline; margin:10px; font-size:11px; ");


    const immidiateChildrenNumber = document.createElement('span');
    immidiateChildrenNumber.setAttribute('id',`immidiateChildren${details['employee_id']}`);
    immidiateChildrenNumber.innerHTML = this.childrenNode[details['employee_id']]? this.childrenNode[details['employee_id']].length : 0;
    immidiateChildrenNumber.setAttribute('style',"diaplay:inline-block; margin: 0px 2px ");

    const totalChildrenNumber = document.createElement('span');
    let count = 0;
    let queue = this.childrenNode[details["employee_id"]] ? this.childrenNode[details["employee_id"]].slice(0) : [];
    count = queue.length;
    while (queue.length > 0) {
      const child = queue.shift();
      if(this.childrenNode[child.id]){
        count = count + this.childrenNode[child.id].length;
        queue = this.childrenNode[child.id].slice(0).concat(queue);
      }
    }
    totalChildrenNumber.setAttribute('id','totalChildrenNumber');
    totalChildrenNumber.innerHTML= count;
    totalChildrenNumber.setAttribute('style',"diaplay:inline-block; margin: 0px 2px");

    bottomDiv.appendChild(immidiateChildrenNumber);
    bottomDiv.appendChild(totalChildrenNumber);

    card.append(header);
    card.append(centerDiv);
    card.append(bottomDiv);
    card.addEventListener('click',(event) => {
      const id = details["employee_id"];
      this.empData[id].show= !this.empData[id].show;
      console.log(document.getElementById(`teamName${id}`));
      event.stopPropagation();
      this.createDOM();
      document.getElementById(`teamName${id}`).style.background="red";
    });

    return card;
  }


  this.createDOM = function(){
    const container = document.getElementById('container');
    container.innerHTML = '';
    this.parentNodes.forEach(item => {
      container.appendChild(this.createCard(this.empData[item]));
      if(this.empData[item].show){
        let queue = this.childrenNode[item].slice(0);
        while (queue.length > 0) {
          const child = queue.shift();
          const parentDiv = document.getElementById(child.parentId);
          parentDiv.appendChild(this.createCard(this.empData[child.id]));
          if(this.childrenNode[child.id] && this.empData[child.id].show){
            queue = this.childrenNode[child.id].slice(0).concat(queue);
          }
        }
      }
    });
  }

  this.init = function() {
    const normalizedData = normalizeInputData(data.employee);

    this.parentNodes = normalizedData.parentNodes;
    this.childrenNode = normalizedData.childrenNode;
    this.empData = normalizedData.empData;
    this.createDOM();
    }

    this.init();
}

new createTree(companyData);
