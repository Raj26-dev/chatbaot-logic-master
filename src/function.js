import React, { useState } from "react";
import ReactFileReader from "react-file-reader";
export default function Question(
  item,
  callback,
  fetched,
  checkboxhandler,
  textchangehandler,
  handlebutton,
  imageHandler
) 

{
  const reader = new FileReader();
  const radiobuttonhandler = e => {
    let answers = [
      {
        answer: e.target.value
      }
    ];
    callback(item, answers);
  };

  const selecthandler = e => {
    let answers = [
      {
        answer: e.target.value
      }
    ];
    callback(item, answers);
  };
  const filechangehandler = (item, event) => {
    
    // if (event.target.files[0]) {
    //   console.log("picture: ", event.target.files);
    //   setPicture(event.target.files[0]);
    //   const reader = new FileReader();
    //   reader.addEventListener("load", () => {
    //     setImgData(reader.result);
    //   });
    //   reader.readAsDataURL(event.target.files[0]);
    //   let answers = [
    //     {
    //       answer:reader.readAsDataURL(event.target.files[0]),
          
    //     },
    //   ];
    //   callback(item, answers);
    // }
    
    // !* new code start
    // let file = event.target.files[0];
    // if (file) {
    //   let x;
    //   let fileReader = new FileReader();
    //   //! Implement onLoad function
    //   console.log(fileReader)
    //   fileReader.onload = (event) => {
    //     x = event.target.result.name;
    //   };
    //   console.log(x);
      
    //   let answers = [
    //     {
    //       answer: "file",
    //     },
    //   ];
    //   callback(item, answers);
    // }
    // !* new code end
    // ! old code start
    let answers = [
      {
        answer: event.target.files[0].name
      }
    ];
    callback(item, answers);
    // ! old code end
  };
  // const [date, setDate]=useState(new Date())
  const datetimehandler = e => {
    // setDate({e})
    let answers = [
      {
        answer: e.target.value
      }
    ];
    callback(item, answers);
  };
  const timehandler = e => {
    let answers = [
      {
        answer: e.target.value
      }
    ];
    callback(item, answers);
  };
  const textareachangehandler = e => {
    let answers = [
      {
        answer: e.target.value
      }
    ];
    callback(item, answers);
  };
  // for multiselect checkbox function of click (select all, unselect all)
  // function UnSelectAll(){
  //   var items=document.getElementsByName('checkbox1');
  //   for(var i=0; i<items.length; i++){
  //     if(items[i].type=='checkbox')
  //       items[i].checked=false;
  //   }
  // }

  // function selectAll(){
  //   var items=document.getElementsByName('checkbox1');
  //   for(var i=0; i<items.length; i++){
  //     if(items[i].type=='checkbox')
  //       items[i].checked=true;
  //   }
  // }
  // for multiselect checkbox function of click (select all, unselect all) end
  let htmlElement;
  switch (item.type_of_control) {
    case "Button":
      htmlElement = (
        <div key={item.id}>
          <label htmlFor={item.id}>
            {item.message}
          </label>
          {item.options.map(item => {
            return (
              <div key={item.label}>
                <label htmlFor={item.label}>
                  {item.label}
                </label>
                <input
                  type="radio"
                  name="radiobutton"
                  value={item.value}
                  id={item.label}
                  onChange={e => radiobuttonhandler(e)}
                />
              </div>
            );
          })}
        </div>
      );
      break;
    case "Multiselect":
      let array = item.options.map(({ label, option_id, trigger, value }) => {
        return {
          label: label,
          value: value,
          ischecked: false,
          option_id: option_id,
          trigger: trigger
        };
      });
      console.log("array", array);
      htmlElement = (
        <div>
          <label htmlFor={item.option_id}>
            {item.question}
          </label>
          {array.map((option, index) => {
            return (
              <span className="multicheck" key={index}>
                <input
                  type="checkbox"
                  name="checkbox1"
                  value={option.value}
                  id={option.value}
                  onChange={event => checkboxhandler(event, array)}
                />
                <label htmlFor={option.value}>
                  {option.value}
                </label>
              </span>
            );
          })}
          {/*//* button for selectall, unselect all start */}
          {/* <p>
          <input type="button" onClick={()=>selectAll()} value="select All"/>
         <input type="button" onClick={()=>UnSelectAll()} value="Unselect All"/>
      </p> */}
          {/* //*button for selectall, unselect all end */}
        </div>
      );
      break;
    case "Text":
      htmlElement = (
        <div>
          <label htmlFor={item.id}>
            {item.message}
          </label>
        </div>
      );
      break;
    case "textarea":
      htmlElement = (
        <div>
          <label htmlFor={item.id}>
            {item.message}
          </label>
        </div>
      );
      break;

    case "Dropdown":
      htmlElement = (
        <div>
          <label htmlFor="dropdown">
            {item.question}
          </label>

          <select
            name="dropdown"
            id="dropdown"
            onChange={e => selecthandler(e)}
          >
            <option>select option from list</option>
            
            {item.options.map(option =>
              <option key={option.option_id} value={option.value}>
                {option.value}
              </option>
            )}
          </select>
        </div>
      );
      break;
    case "File":
      htmlElement = (
        <div>
          <label htmlFor="myfile">
            {item.message}
          </label>
          <input
            type="file"
            id="myfile"
            name="myfile"
            accept="image/*"
            onChange={e => {
              console.log(e.target.files[0]);
              imageHandler(item, e);
            }}
          />
        </div>
      );
      break;
    case "Datepicker":
      htmlElement = (
        <div>
          <label htmlFor="datepicker">
            {/* {item.message} */}
          </label>

          <input
            type="date"
            // placeholder="dd-mm-yyyy"
            id="datepicker"
            name="datepicker"
            onChange={e => {
              // console.log(e.target.files[0]);
              textchangehandler(e);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                console.log(event);
                handlebutton();
              }
            }}
          />
        </div>
      );
      break;
    case "Timepicker":
      htmlElement = (
        <div>
          <label htmlFor="timepicker">
            {item.message}
          </label>

          <input
            type="time"
            id= "timepicker"
            name="timepicker"
            onChange={e => {
              // console.log(e.target.files[0]);
              textchangehandler(e);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                console.log(event);
                handlebutton();
              }
            }}
          />
        </div>
      );
      break;
    case "Textarea":
      htmlElement = (
        <div>
          <label htmlFor="myfile">
            {item.message}
          </label>

          <textarea
            style= {{marginTop:"10px"}}
            rows="3"
            cols="27"
            placeholder={item.message}
            name={"Textarea"}
            onChange={e => {
              textchangehandler(e);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                console.log(event);
                handlebutton();
              }
            }}
          />
        </div>
      );
    default:
      case "location":

      return htmlElement;
  }
  return htmlElement;
}
