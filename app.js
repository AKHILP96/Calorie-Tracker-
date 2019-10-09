//Storage controller 
const StorageCtrl = (function(){
	return{
		storeItem: function(item){
			let items ;
			//check if any items in local storage

			if(localStorage.getItem('items') === null){
				items = [];
				//push new item
				items.push(item);
				//set ls
				localStorage.setItem('items',JSON.stringify(items));
			}else{
				//get from ls 
				items = JSON.parse(localStorage.getItem('items'));

				//push the new item 
				items.push(item);

				//reset ls 
				localStorage.setItem('items',JSON.stringify(items));
			}
		},
		getItemFromStorage: function(){
			let items;	
			if(localStorage.getItem('items') == null){
				items = []; 
			}else{
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items;
		},
		updateItemStorage:function(updateItem){
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach(function(item,index){
				if(updateItem.id === item.id){
					items.splice(index,1,updateItem);
				}
			});

			localStorage.setItem('items',JSON.stringify(items));

		},
		deleteItemFromStorage: function(updateItem){
		let items = JSON.parse(localStorage.getItem('items'));

			items.forEach(function(item,index){
				if(updateItem.id === item.id){
					items.splice(index,1);
				}
			});

			localStorage.setItem('items',JSON.stringify(items));
	
		},
		clearItemsFromStorage: function(){
			localStorage.removeItem('items');
		}
	}
})();


//Item controller 
const ItemCtrl = (function(){
		//item constructor
		const Item = function(id,name,calories){
			this.id = id;
			this.name = name;
			this.calories = calories;
		}

		//ds for storing / state 
		const data = {
			items: StorageCtrl.getItemFromStorage(),
			currentItem: null,
			totalCalories: 0
		}

		return{
			getItems: function(){
				return data.items;
			},
			addItem: function(name,calories){
				//creat ID 
				//console.log(data.items[data.items.length-1].id+1);
				let ID;
				if(data.items.length>0){
					ID = data.items[data.items.length-1].id+1;
				}else{
					ID = 0;
				}

				// calories to number 
			    calories = parseInt(calories);

			    //create new item
			    newItem = new Item(ID,name,calories);

			    //push item to ds
			    data.items.push(newItem);

			    return newItem;
			},
			getItemById: function(id){
				let found  = null;
				//loop through 
				data.items.forEach(function(item){
					if(item.id == id){
						found = item;
					}
				});
				return found;
			},
			updateItem: function(name,calories){
				//calories to numbetr 
				calories = parseInt(calories);
				let found = null;
				data.items.forEach(function(item){
					if(item.id == data.currentItem.id){
						item.name = name;
						item.calories = calories;
						found = item;
					}
				});
				return found;
			},
			deleteItem: function(id){
				//get the ids using map
				 const ids = data.items.map(function(item){
					return item.id;
				});

				 //get index
				 const index = ids.indexOf(id);

				 //remove item
				 data.items.splice(index,1);
			},
			clearAllItems: function(){
				data.items = [];
			},
			setCurrenItem:function(item){
				data.currentItem = item;
			},
			getCurrentItem:function(){
				return data.currentItem;
			},
			getTotalCalories:function(){
				let total = 0;
				//;loop through itesm and add cal
				data.items.forEach(function(item){
					total += item.calories;
				});

				//set total calories 
				data.totalCalories = total;

				//return total
				return data.totalCalories;
			},
			logData : function(){
				return data;
			}
		}
})();

//UI controller 
const UICtrl = (function(){
		const UISelector ={
			itemList : '#item-list',
			addBtn: '.add-btn',
			updateBtn: '.update-btn',
			deleteBtn: '.delete-btn',
			backBtn: '.back-btn',
			clearBtn:'.clear-btn',
			itemNameInput: '#item-name',
			itemCaloriesInput: '#item-calories',
			totalCalories:'.total-calories',
			listItems: '#item-list li'
		}
		return{
			populateItemList:function(items){
				let html = '';
				console.log(items);
				items.forEach(function(item){
					html += `<li class="collection-item" id="item-${item.id}">
				<strong>${item.name}:</strong> <em>${item.calories}calories</em>
				<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
			</li>`;
				});
				//console.log(html);
				//console.log(document.querySelector('#item-list'));
				//insert list item 
				document.querySelector(UISelector.itemList).innerHTML = html;
			},
			getItemInput: function(){
				return{
					name:document.querySelector(UISelector.itemNameInput).value,
					calories:document.querySelector(UISelector.itemCaloriesInput).value
				}
			},
			addListItem:function(item){
				//show list 
				document.querySelector(UISelector.itemList).style.display = 'block';
				//create li element 
				const li = document.createElement('li');
				//add class 
				li.className = 'collection-item';
				//add id
				li.id = `item-${item.id}`;
				console.log("yo");
				//add html
				li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories}calories</em>
				<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

				//insert item
				document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li);
			},
			 updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelector.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
			deleteListItem: function(id){
				const itemID = `#item-${id}`;
				const item = document.querySelector(itemID);
				item.remove(); 
			},
			clearInput: function(){
				document.querySelector(UISelector.itemNameInput).value = '';
				document.querySelector(UISelector.itemCaloriesInput).value = '';
			},
			addItemToForm:function(){
				document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
				document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
				UICtrl.showEditState();
			},
			removeItems: function(){
				let listItems = document.querySelectorAll(UISelector.listItems);
				// turn node list to array 
				listItems = Array.from(listItems);

				listItems.forEach(function(item){
					item.remove;
				});
			},
			hideList: function(){
				document.querySelector(UISelector.itemList).style.display = 'none';
			},
			showTotalCalories:function(totalCalories){
				document.querySelector(UISelector.totalCalories).textContent = totalCalories;
			},
			clearEditState: function(){
				UICtrl.clearInput();
				document.querySelector(UISelector.updateBtn).style.display = 'none';
				document.querySelector(UISelector.deleteBtn).style.display = 'none';
				document.querySelector(UISelector.backBtn).style.display = 'none';
				document.querySelector(UISelector.addBtn).style.display = 'inline';

			},
			showEditState: function(){
				
				document.querySelector(UISelector.updateBtn).style.display = 'inline';
				document.querySelector(UISelector.deleteBtn).style.display = 'inline';
				document.querySelector(UISelector.backBtn).style.display = 'inline';
				document.querySelector(UISelector.addBtn).style.display = 'none';

			},
			getSelectors: function(){
				return UISelector;
			}
		}
})();

//App controller 
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
		
	//load event listeners
	const loadEventListeners = function(){
		const UISelector = UICtrl.getSelectors();
		//console.log(UISelector.itemNameInput);
		//add item even
		document.querySelector(UISelector.addBtn).addEventListener('click',itemAddSubmit);

		//disable submit on enter
		document.addEventListener('keypress',function(e){
			if(e.keyCode == 13 || e.which == 13){
				e.preventDefault();
				return false;
			}
		});
	
		//edit icon click event
		document.querySelector(UISelector.itemList).addEventListener('click',itemEditClick);

		//update item event 
		document.querySelector(UISelector.updateBtn).addEventListener('click',itemUpdateSubmit);
	
		//delete item 
		document.querySelector(UISelector.deleteBtn).addEventListener('click',itemDeleteSubmit);
		
		//back buttoon event 
		document.querySelector(UISelector.backBtn).addEventListener('click',UICtrl.clearEditState);

		//clear items event 
		document.querySelector(UISelector.clearBtn).addEventListener('click',clearAllItemsClick);
		
	}

	// add item submit
	const itemAddSubmit = function(e){
		//get form input from ui controller 
		//console.log('add');
		const input = UICtrl.getItemInput();

		//check for name and calorie
		if(input.name !== '' && input.calorie !== ''){
			//add item
			console.log(input.name);
			const newItem = ItemCtrl.addItem(input.name,input.calories);
			console.log(newItem);
			// add item to ui list 
			UICtrl.addListItem(newItem);

			//get total calories 
			const totalCalories = ItemCtrl.getTotalCalories();

			//show it in ui 
			UICtrl.showTotalCalories(totalCalories);

			//store in localStorage 
			StorageCtrl.storeItem(newItem);
			//clear fields 
			UICtrl.clearInput();
		}
		//console.log(input.name);
		e.preventDefault();
	}

	//clikc edit item
	const itemEditClick = function(e){
		if(e.target.classList.contains('edit-item')){
		//	console.log('editi-item');
			// get list item id e = i i->a->li and li has id so. 
			const listId = e.target.parentNode.parentNode.id;

			//break into an array 
			const listIdArray = listId.split('-');

			//get the actual id 
			const id = parseInt(listIdArray[1]);

			//get item to edit 
			const itemToEdit = ItemCtrl.getItemById(id);

			//set current item
			ItemCtrl.setCurrenItem(itemToEdit);

			//add item to form
			UICtrl.addItemToForm();
		}
		//console.log('test');
		e.preventDefault();
	}

	//update item submit 
	const itemUpdateSubmit = function(e){
		//console.log('update');
		//ge titem input 
		const input = UICtrl.getItemInput();
		console.log(input.name);
		const updateItem = ItemCtrl.updateItem(input.name,input.calories);
		console.log(updateItem);
		//update ui 
		UICtrl.updateListItem(updateItem);

		const totalCalories = ItemCtrl.getTotalCalories();

			//show it in ui 
			UICtrl.showTotalCalories(totalCalories);
			//update local storage
			StorageCtrl.updateItemStorage(updateItem);
			UICtrl.clearEditState(); 
		e.preventDefault();
	}

	//delete vbutton event
	const itemDeleteSubmit = function(e){
		//get current item
		const currentItem = ItemCtrl.getCurrentItem();
		//delete from ds 
		ItemCtrl.deleteItem(currentItem.id);

		//delete from ui
		UICtrl.deleteListItem(currentItem.id);
		const totalCalories = ItemCtrl.getTotalCalories();

			//show it in ui 
			UICtrl.showTotalCalories(totalCalories);

			//delete from local storage
			StorageCtrl.deleteItemFromStorage(currentItem);

			UICtrl.clearEditState(); 
		e.preventDefault();
	}

	//clear items event 
	const clearAllItemsClick = function(){
		//delet all items from ds 
		ItemCtrl.clearAllItems();

		const totalCalories = ItemCtrl.getTotalCalories();

			//show it in ui 
			UICtrl.showTotalCalories(totalCalories);

		//UI for delete all 
		UICtrl.removeItems();
		//remove from local storage
		StorageCtrl.clearItemsFromStorage();
		//hide ul
		UICtrl.hideList();


	}

	return {
		init: function(){
			//clear edit state / set inital set 
			UICtrl.clearEditState();

			console.log('Initalizing app');
			const items = ItemCtrl.getItems();

			//check if any items 
			if(items.length == 0){
				UICtrl.hideList();
			//	console.log("yo");
			//	loadEventListeners();
			}else{
			UICtrl.populateItemList(items);
			}
			

			//get total calories 
			const totalCalories = ItemCtrl.getTotalCalories();
			UICtrl.showTotalCalories(totalCalories);
			loadEventListeners(); 
		}
	}

})(ItemCtrl,StorageCtrl,UICtrl);

//initialize app
App.init();