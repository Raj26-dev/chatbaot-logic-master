import React, { useState, useEffect, useRef } from "react";
// import "./App.scss";
import "./App.css"
import ReactTooltip from "react-tooltip";

import axios from "axios";
import Questionhandler from "./function";
import avatar from "./images/avatar.png";
import avatarorange from "./images/avatar-white.png";
import avatarwhite from "./images/avatar-white.png";
import chat from "./images/chat.png";
import chatbotorange from "./images/chatbot-orange.png";
import chatbotwhite from "./images/chatbot-white.png";
import chatbot from "./images/chatbot-white.png";
import chaticon from "./images/chaticon.png";
import close from "./images/close.png";
import email from "./images/email.png";
import fav from "./images/favicon.png";
import paper_plane from "./images/paper-plane.png";
import send from "./images/send.png";
import tick from "./images/tick.png";
import voice from "./images/voice.png";
import chatIcon from './images/chaticon.png';




// const Messages = ({ messagess }) => {
//   const messagesEndRef = useRef(null);
//   const scrollToBottom = () => {
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   };
//   useEffect(scrollToBottom, [messagess]);

//   return (
//     <>
//     <div className="messagesWrapper">
//       {messagess.map(message => (
//         <span key={message}>{message}</span>
//       ))}
//       <div ref={messagesEndRef} />
//     </div>
//     </>
//   );
// };


function App() {
  var selected = [];
  const initialformstate = {
    userresponse: [],
  };
//   const divRref = useRef(null);

//  useEffect(() => {
//    divRref.current.scrollIntoView({ behavior: 'smooth' });
//  });

  const [questions, setquestions] = useState([]);
  const [text, settext] = useState("");
  const [storedquestions, setstoredquestions] = useState({});

  const [currentquestion, setcurrentquestion] = useState({});
  const [counter, setcounter] = useState(0);
  const [form, setform] = useState(initialformstate);
  const [fetched, setfetched] = useState(false);
  const [islastitem, setislastitem] = useState(false);
  const [image, setimage] = useState("");
  const [error, setError] = useState(); //* for validation msg 
  const [Errorimage, setErrorimage] = useState(""); //* for file error msg handling
 const[showimg, setShowimg]=useState(null);

// * record start
 async function startRecording(setRecorderState) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    setRecorderState((prevState) => {
      return {
        ...prevState,
        initRecording: true,
        mediaStream: stream,
      };
    });
  } catch (err) {
    console.log(err);
  }
}




 function saveRecording(recorder) {
  if (recorder.state !== "inactive") recorder.stop();
}
// * record end
 
// new code for api call one time (start)
const handleFetch = async () => {
  const res = await axios.get(
    "https://tbsdemos.com/bot_uat/api/Login/question"
  );
  console.log(res.data);
  window.sessionStorage.setItem("campaign_id", res.data.campaign_id);
  window.sessionStorage.setItem("user_id", res.data.user_id);
  window.sessionStorage.setItem("questions", JSON.stringify(res.data.data));
  window.sessionStorage.setItem("lastleftquestion", 0);

  setquestions(res.data.data);
  setcurrentquestion(res.data.data[0]);
  setfetched(true);
};

const localfetch = async () => {
  let response = await JSON.parse(sessionStorage.getItem("questions"));

  setquestions(response);
  console.log(JSON.parse(sessionStorage.getItem("questions")));

  // let l = parseInt(sessionStorage.getItem("lastleftquestion"));
  setcounter(parseInt(sessionStorage.getItem("lastleftquestion")));
  setcurrentquestion(
    response[parseInt(sessionStorage.getItem("lastleftquestion"))]
  );
  setfetched(true);
};

useEffect(() => {
  if (window.sessionStorage.getItem("chatbotdata")) {
    console.log(JSON.parse(window.sessionStorage.getItem("chatbotdata")));
    setform(JSON.parse(window.sessionStorage.getItem("chatbotdata")));
    setstoredquestions(
      JSON.parse(window.sessionStorage.getItem("chatbotdata")).userresponse
    );
  }
  if (window.sessionStorage.getItem("questions") !== null) {
    localfetch();
  } else {
    handleFetch();
  }
}, []);

useEffect(()=>{
  window.onbeforeunload = () => {
    // Clear the local storage
    // window.sessionStorage.removeItem("questions");
          // window.sessionStorage.removeItem("chatbotdata");
          // sessionStorage.removeItem("campaign_id");
          // window.sessionStorage.removeItem("user_id");
          // window.sessionStorage.removeItem("lastleftquestion");
 }
},[]);
//* new code for api call one time (end)


  
  useEffect((event) => {
    if (window.sessionStorage.getItem("lastleftquestion") !== "full") {
      setcurrentquestion(questions[counter]);
    }
    console.log(showimg)
    console.log(counter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  //* handle submit for manage post Api start
  const handleSubmit = async (obj1, answers) => {
  console.log(obj1);
  let x = document.getElementById("chatMiddlee");
  // console.log(x.scrollHeight - x.clientHeight);
  // console.log(obj1, answers);
    const response = {
      question: obj1.question,
      type_of_control : obj1.type_of_control,
      answers: answers,
    };
    let uservalues = [...form.userresponse, { item: obj1, response: response }];

    setform({ ...form, userresponse: uservalues });
    // console.log({ ...form, userresponse: uservalues });
    window.sessionStorage.setItem(
      "chatbotdata",
      JSON.stringify({ ...form, userresponse: uservalues })
    );

    setstoredquestions({ ...form, userresponse: uservalues }.userresponse);
    if (counter >= questions.length - 1) {
      window.sessionStorage.setItem("lastleftquestion", "full");
      axios
        .post("https://tbsdemos.com/bot_uat/api/Login/test", {
          // flag:window.sessionStorage.setItem("flag","submit"),
          // flag:window.sessionStorage.getItem("flag"),
          user_id: window.sessionStorage.getItem("user_id"),
          campaign_id: window.sessionStorage.getItem("campaign_id"),

          json: JSON.parse(window.sessionStorage.getItem("chatbotdata"))
            .userresponse,
        })
        .then((res) => {
          setislastitem(true);
          // window.sessionStorage.removeItem("flag");
          window.sessionStorage.removeItem("questions");
          window.sessionStorage.removeItem("chatbotdata");
          window.sessionStorage.removeItem("campaign_id");
          window.sessionStorage.removeItem("user_id");
          window.sessionStorage.removeItem("lastleftquestion");
          // window.location.reload()
          console.log(res);
        })
        .catch(function (error) {
          console.log(error);
          
        });
      setcounter("full");
      alert("thanks");
    } else {
      x.scrollTop = x.scrollHeight - x.clientHeight;

      window.sessionStorage.setItem("lastleftquestion", counter + 1);
      setcounter((counter) => counter + 1);
    }
  };
  //* handle submit end

  // * Error handler for showing validation msg in tooltip (start)
  const Errorhandler = (message) => {
    setError(message);
  };
  // * Error handler for showing validation msg in tooltip (end)

  // * send button onClick handler start
  function handlebutton() {
    //! e.preventDefault();

    // TODO: this code for validation start
    switch (currentquestion.type_of_control) {
      //* this for validation 
      case "Text":
        let regex = currentquestion.validation[1].pattern;
        let output = text.match(regex);
        console.log(output);
        if (text.trim() === "") {
          Errorhandler(currentquestion.validation[0].message);
        }
        // else if(currentquestion.validation[0].pattern === "NA"){
        //   Errorhandler(currentquestion.validation[0].message);
        // } 
        else if (output === null) {
          Errorhandler(currentquestion.validation[1].message);
        }
        else {
                handleSubmit(currentquestion, [{ answer: text }]);
                settext("");
              } 
          
        break;
      case "Textarea":
          if(text.trim() === ""){
            Errorhandler(currentquestion.validation[0].message)
          }else {
            handleSubmit(currentquestion, [{ answer: text }]);
            settext("");
          }
          break;

      case "Datepicker":
        let regex1 = currentquestion.validation[1].pattern;
        let outputs = text.match(regex1);  
        console.log(text)
        if (text.trim() === "") {
          Errorhandler(currentquestion.validation[0].message);
        }
        else if (outputs === null) {
          Errorhandler(currentquestion.validation[1].message);
        }
        else {
                handleSubmit(currentquestion, [{ answer: text }]);
                settext("");
              }
        break;
      case "Timepicker":
        let regex2 = currentquestion.validation[1].pattern;
        let outputs2 = text.match(regex2);
        if (text.trim() === "") {
          Errorhandler(currentquestion.validation[0].message);
        }
        
        else if (outputs2 === null) {
          Errorhandler(currentquestion.validation[1].message);
        }
        else {
          handleSubmit(currentquestion, [{ answer: text }]);
          settext("");
        }
        break;
        case "File":
        Errorimage === "" ? Errorhandler(currentquestion.validation[0].message) : Errorhandler("");
        break;
        // case "File":
        // Errorimage === "" ? Errorhandler("file is required") : handleSubmit(currentquestion,[{answer : text}]);
        // settext("");;
        // break;  
        default:
          
          break;
    }
    // TODO: this code for validation end

    if (currentquestion.type_of_control === "Multiselect") {
      let answers = selected.filter((item) => item.ischecked === true);
      if (answers.length <= 0) {
        
        Errorhandler(currentquestion.validation[0].message);
      } else {
        Errorhandler("");
        handleSubmit(currentquestion, [
          { answer: answers.map((item) => item.value).join(",") },
        ]);
      }

      //! handleSubmit(currentquestion, [
      //!   { answer: answers.map((item) => item.value).join(",") },
      //! ]);
    } 
    // else {
    //   if (
    //     currentquestion.type_of_control === "Text" ||
    //     currentquestion.type_of_control === "Textarea" ||
    //     currentquestion.type_of_control === "Datepicker" ||
    //     currentquestion.type_of_control === "Timepicker"
    //     ) {
    //     if (text.trim() === "") {
    //       //alert("Value Required");
    //     } else {
    //       handleSubmit(currentquestion, [{ answer: text }]);
    //       settext("");
    //     }
    //   }

    // }
  }
  // * send button onClick handler end

  //* text onchange handler start
  const textchangehandler = (e) => {
    settext(e.target.value);
    Errorhandler("");
  };
  //* text onchange handler end

  // * checkbox onchange handler start
  const checkboxhandler = (e, array) => {
    array.forEach((fruite) => {
      if (fruite.value === e.target.value) fruite.ischecked = e.target.checked;
    });
    selected = [...array];
    console.log("selected", selected);
  };
  //* checkbox onchange handler end

  //* toggel open close start
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen((isOpen) => !isOpen)
  }
  //* toggel open close end

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // * file onchange handler start
  const imageHandler = (item, event) => {
    // setShowimg(URL.createObjectURL(event.target.files[0]))
    // console.log(URL.createObjectURL(event.target.files[0]))
    // window.sessionStorage.setItem("img1",(URL.createObjectURL(event.target.files[0])))
    // if (event.target.files[0]) {
    //   let answer;
    //   let b64;
    //   // answer = event.target.files[0];
    //   var file = event.target.files[0],
      
    //     reader = new FileReader();

    //   reader.onloadend = async function () {
    //     //* Since it contains the Data URI, we should remove the prefix and keep only Base64 string   .replace(/^data:.+;base64,/, "");
    //     console.log( reader.result);
    //     let b64 = await reader.result.replace(/^data:.+;base64,/, "");
        

    //     // * compress of encoded image/ mp3/mp4

    //     // let compressedImg = b64.split('').reduce((o, c) => {
    //     //   if (o[o.length - 2] === c && o[o.length - 1] < 35) o[o.length - 1]++;
    //     //   else o.push(c, 0);
    //     //   return o;
    //     // },[]).map(_ => typeof _ === 'number' ? _.toString(36) : _).join('');

    //     // * decompress of encoded 
        
        
    //     setimage(b64);
    //     // console.log(b64)
    //     let answers = [
    //       {
    //         answer: b64,
    //       },
    //     ];
    //     handleSubmit(item, answers);
    //     // document.getElementById("unique").src = reader.result.replace(
    //     //   /^data:.+;base64,/,
    //     //   ""
    //     // );
    //     setimage(b64);
    //     console.log(b64);
    //   };

    //   reader.readAsDataURL(file);

       
    //   let answers = [
    //     {
    //       answer: image,
    //     },
    //   ];
    //   setErrorimage(false);
    //   Errorhandler("");
    // }else{
    //   setErrorimage(true);
    //   Errorhandler("pls upload a file with data");
    // }

    if (event.target.files[0]) {
      const file = event.target.files[0];
      getBase64(file).then((base64) => {
        sessionStorage["image"] = base64;

        let answers = [
          {
            answer: base64.replace(/^data:.+;base64,/, ""),
            type: file.type,
          },
        ];
        handleSubmit(item, answers);
        //console.debug("file stored", base64);
      });
      setErrorimage(false);
      Errorhandler("");
    } else {
      setErrorimage(true);
      Errorhandler("pls upload a file with data");
    }
  };
  // * file onchange handler end
  // * voice recording start
  
  

  return (
    <>
      <img className="chatIcon" src={chaticon} alt={"chatIcon"} onClick={togglePopup}/>
      <div className={`${!isOpen ? "active": ""} show chatBox`}>
        <div className="chatHeader">
          <h1>ICICI Foundation</h1>
          <button className="emailIcon">
            <img src={email} alt={"email"} />
          </button>
          <button className="closeIcon" onClick={togglePopup}>
            <img src={close} alt={"chatBot"} />
          </button>
        </div>
        {/* <Messages messages= {currentquestion}> */}
        <div className="chatMiddle" id="chatMiddlee" >
          {/* {fetched === true ? <h1>...</h1> : ""} */}
          {Object.keys(storedquestions).length > 0 && (
            <div className="results">
              {storedquestions.map((question, index) => (
                <div key={index} className="response-1">
                  <div className="response-2">
                    <img src={chatbot} alt={"chatBot"} />
                   {fetched === false? <h1>...</h1>: ""}
                   <p> {question.item.message}</p>
                  </div>
                  
                  {question.item.type_of_control === "Checkbox" && (
                    <div className="response-3">
                      <ul className="ul-response-1">
                        {question.response.answers[0].answer
                          // .split(",")
                          .map((item, index) => (
                            <li key={index} className="li-response-1">
                              <img src={fav} alt={"listicon"} /> {item}
                            </li>
                          ))}
                      </ul>
                      <img  src={avatarorange} alt={"avatar"} />
                    </div>
                  )}

                  {question.item.type_of_control !== "Checkbox" && (
                    <div className="response-3">
                      <ul className="ul-response-1">
                        {question.item.type_of_control === "File" && (
                          <img
                            alt="uploaded"
                            src={showimg ? showimg : window.sessionStorage.getItem("image")}
                            id="unique"
                            style={{ width: "60px", height: "60px" }}
                          />
                        )}
                        

                        {question.item.type_of_control !== "File" &&
                          question.response.answers.map((item, index) => (
                            <li key={index} className="li-response-1">
                              <img src={fav} alt={"listicon"} /> {item.answer}
                            </li>
                        ))}
                      </ul>
                      <img className="imgavtart" src={avatarorange} alt={"avatar"} />
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
          {window.sessionStorage.getItem("lastleftquestion") === "full" ? (
            <p className="submitMsg">You have answered all questions.</p>
          ) : (
            <></>
          )}
          {window.sessionStorage.getItem("lastleftquestion") !== "full" &&
          currentquestion ? (
            <div className="response-2">
                  <img src={chatbot} alt={"chatBot"} />
              {Questionhandler(
                currentquestion,
                handleSubmit,
                fetched,
                checkboxhandler,
                textchangehandler,
                handlebutton,
                imageHandler,
                Errorhandler
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* </Messages> */}
        
        <div className="inputFooter">
          <div className="inputHolder">
            {fetched === true && currentquestion ? (
              <>
                <input
                  id={currentquestion.id}
                  placeholder={currentquestion.placeholder}
                  value={text}
                  type="text"
                  onChange={(e) => {
                    textchangehandler(e);
                  }}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      console.log(event);
                      handlebutton();
                    }
                  }}
                  style={{
                    display:
                      currentquestion.type_of_control === "Textarea"
                        ? "none"
                        : "block",
                  }}
                  disabled={currentquestion.type_of_control !== "Text"}
                />
                 {
                    error && 
                    <div
                    className="side"
                    style={{
                      // transform: "translate3d(5px, 5px, 5px)",
                      position: "absolute",
                      right: "72px",
                      top: "18px",
                    }}
                    >
                    <a data-tip="tooltip" data-for="happyFace">
                      !
                    </a>
                    <ReactTooltip
                      id="happyFace"
                      // style={{width:"100px", height:"10px"}}
                      type="error"
                      place="top"
                      // effect="solid"
                    >
                      <span>{error}</span>
                    </ReactTooltip>
                  </div>
                  }
                {/* {currentquestion.type_of_control === "Textarea" && (
                  <div>
                    <label>{currentquestion.message}</label>
                  <textarea
                    placeholder={currentquestion.message}
                    name={"Textarea"}
                    onChange={(e) => {
                      textchangehandler(e);
                    }}
                    ></textarea>
                    </div>
                )} */}
                <button
                  className="sendBtn"
                  onClick={(e) => handlebutton()}
                  disabled= {
                      counter === "full" ||
                      currentquestion.type_of_control === "Button" || 
                      currentquestion.type_of_control === "Dropdown"
                      // currentquestion.type_of_control ==="File"
                  }
                  // disabled= {currentquestion.type_of_control !== "Checkbox"}
                  // disabled = {window.sessionStorage.getItem("lastleftquestion", "full")}
                >
                  <img src={send} />
                </button>
              </>
            ) : (
              <></>
            )}

            <button className="mikeBtn" onClick={startRecording}>
              <img src={voice} alt="mic button" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


export default App;
