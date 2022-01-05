import React, { useState, useEffect } from "react";
import "./App.css";

import axios from "axios";
import Questionhandler from "./function";
import avatar from "./images/avatar.png";
import avatarorange from "./images/avatar-orange.png";
import avatarwhite from "./images/avatar-white.png";
import chat from "./images/chat.png";
import chatbotorange from "./images/chatbot-orange.png";
import chatbotwhite from "./images/chatbot-white.png";
import chatbot from "./images/chatbot.png";
import chaticon from "./images/chaticon.png";
import close from "./images/close.png";
import email from "./images/email.png";
import fav from "./images/favicon.png";
import paper_plane from "./images/paper-plane.png";
import send from "./images/send.png";
import tick from "./images/tick.png";
import voice from "./images/voice.png";
import localdata from "./data.json";
import ReactTooltip from "react-tooltip";

function App() {
  var selected = [];
  const initialformstate = {
    userresponse: [],
  };

  const [questions, setquestions] = useState([]);
  const [text, settext] = useState("");
  const [storedquestions, setstoredquestions] = useState({});
  const [islastitem, setislastitem] = useState(false);
  const [currentquestion, setcurrentquestion] = useState({});
  const [counter, setcounter] = useState(0);
  const [form, setform] = useState(initialformstate);
  const [fetched, setfetched] = useState(false);
  const [Error, setError] = useState("");
  const [Errorimage, setErrorimage] = useState("");
  const [image, setimage] = useState("");



  const handleFetch = async () => {
    const res = await axios.get(
      "https://tbsdemos.com/bot_uat/api/Login/question"
    );
    console.log(res.data);
    window.localStorage.setItem("campaign_id", res.data.campaign_id);
    window.localStorage.setItem("user_id", res.data.user_id);
    window.localStorage.setItem("questions", JSON.stringify(res.data.data));
    window.localStorage.setItem("lastleftquestion", 0);

    setquestions(res.data.data);
    setcurrentquestion(res.data.data[0]);
    setfetched(true);
  };
  const localfetch = async () => {
    let response = await JSON.parse(localStorage.getItem("questions"));

    setquestions(response);
    console.log();

    // let l = parseInt(localStorage.getItem("lastleftquestion"));
    setcounter(parseInt(localStorage.getItem("lastleftquestion")));
    setcurrentquestion(
      response[parseInt(localStorage.getItem("lastleftquestion"))]
    );
    setfetched(true);
  };
  useEffect(() => {
    if (window.localStorage.getItem("chatbotdata")) {
      console.log(JSON.parse(window.localStorage.getItem("chatbotdata")));
      setform(JSON.parse(window.localStorage.getItem("chatbotdata")));
      setstoredquestions(
        JSON.parse(window.localStorage.getItem("chatbotdata")).userresponse
      );
    }
    if (window.localStorage.getItem("questions") !== null) {
      localfetch();
    } else {
      handleFetch();
    }
  }, []);
  useEffect(() => {
    if (window.localStorage.getItem("lastleftquestion") !== "full") {
      setcurrentquestion(questions[counter]);
    }

    console.log(counter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const handleSubmit = async (obj1, answers) => {
    const response = {
      question: obj1.question,
      answers: answers,
    };
    let uservalues = [...form.userresponse, { item: obj1, response: response }];

    setform({ ...form, userresponse: uservalues });

    window.localStorage.setItem(
      "chatbotdata",
      JSON.stringify({ ...form, userresponse: uservalues })
    );

    setstoredquestions({ ...form, userresponse: uservalues }.userresponse);
    console.log({ ...form, userresponse: uservalues }.userresponse);
    if (counter >= questions.length - 1) {
      window.localStorage.setItem("lastleftquestion", "full");
      axios
        .post("https://tbsdemos.com/bot_uat/api/Login/test", {
          user_id: window.localStorage.getItem("user_id"),
          campaign_id: window.localStorage.getItem("campaign_id"),

          json: JSON.parse(window.localStorage.getItem("chatbotdata"))
            .userresponse,
        })
        .then((res) => {
          console.log(res);
          setislastitem(true);
          window.localStorage.removeItem("questions");
          window.localStorage.removeItem("chatbotdata");
          window.localStorage.removeItem("campaign_id");
          window.localStorage.removeItem("user_id");
          window.localStorage.removeItem("lastleftquestion");
          // window.location.reload(false);
        })
        .catch(function (error) {
          console.log(error);
        });
      setcounter("full");
      alert("thanks");
    } else {
      console.log("counter", counter);
      window.localStorage.setItem("lastleftquestion", counter + 1);
      setcounter((counter) => counter + 1);
    }
  };
  const handlebutton = () => {
    switch (currentquestion.type_of_control) {
      case "Text":
        if (text.trim() === "") {
          Errorhandler("value response");
        }
        break;
      case "Textarea":
        if (text.trim() === "") {
          Errorhandler("value Required");
        }
        break;
      case "Datepicker":
        if (text.trim() === "") {
          Errorhandler("value Required");
        }
        break;
      case "Timepicker":
        if (text.trim() === "") {
          Errorhandler("value Required");
        }
        break;
      case "File":
        Errorimage === "" ? Errorhandler("file is required") : Errorhandler("");
        break;

      default:
        break;
    }


    if (currentquestion.type_of_control === "Multiselect") {
      let answers = selected.filter((item) => item.ischecked === true);
      if (answers.length <= 0) {
        Errorhandler("pls select multiple values");
      } else {
        Errorhandler("");
        handleSubmit(currentquestion, [
          { answer: answers.map((item) => item.value).join(",") },
        ]);
      }
    } else {
      if (
        currentquestion.type_of_control === "Text" ||
        currentquestion.type_of_control === "Textarea" ||
        currentquestion.type_of_control === "Datepicker" ||
        currentquestion.type_of_control === "Timepicker"
      ) {
        if (text.trim() === "") {
          // alert("value required");
        } else {
          handleSubmit(currentquestion, [{ answer: text }]);
          settext("");
        }
      }
    }
  };
  const textchangehandler = (e) => {
    settext(e.target.value);
    Errorhandler("");
  };

  const checkboxhandler = (e, array) => {
    array.forEach((fruite) => {
      if (fruite.value === e.target.value) fruite.ischecked = e.target.checked;
    });
    selected = [...array];
    console.log("selected", selected);
  };

  const imageHandler = (item, event) => {
    if (event.target.files[0]) {
      let answer;
      let b64;
      // answer = event.target.files[0];
      var file = event.target.files[0],
        reader = new FileReader();

      reader.onloadend = async function () {
        // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
        let b64 = await reader.result.replace(/^data:.+;base64,/, "");
        setimage(b64);
        let answers = [
          {
            answer: b64,
          },
        ];
        handleSubmit(item, answers);
        document.getElementById("unique").src = reader.result.replace(
          /^data:.+;base64,/,
          ""
        );
        setimage(b64);
        console.log(b64);
      };

      reader.readAsDataURL(file);

      let answers = [
        {
          answer: image,
        },
      ];
      setErrorimage(false);
      Errorhandler("");
    } else {
      setErrorimage(true);
      Errorhandler("pls upload a file with data");
    }
  };

  const Errorhandler = (message) => {
    setError(message);
  };

  return (
    <>
      <img className="chatIcon" src={chaticon} alt={"chatIcon"} />
      <div className="chatBox">
        <div className="chatHeader">
          <h1>ICICI Foundation</h1>
          <button className="emailIcon">
            <img src={email} alt={"email"} />
          </button>
          <button className="closeIcon">
            <img src={chatbot} alt={"chatBot"} />
          </button>
        </div>
        <div className="chatMiddle" id="chatMiddlee">
          {Object.keys(storedquestions).length > 0 && (
            <div className="results">
              {storedquestions.map((question, index) => (
                <div key={index} className="response-1">
                  <div className="response-2">
                    <img src={chatbot} alt={"chatBot"} />
                    <p> {question.item.message}</p>
                  </div>
                  {question.item.type_of_control === "Checkbox" && (
                    <div className="response-3">
                      <ul className="ul-response-1">
                        {question.response.answers[0].answer
                          .split(",")
                          .map((item, index) => (
                            <li key={index} className="li-response-1">
                              <img src={fav} alt={"listicon"} /> {item}
                            </li>
                          ))}
                      </ul>
                      <img src={avatarorange} alt={"avatar"} />
                    </div>
                  )}
                  {question.item.type_of_control !== "Checkbox" && (
                    <div className="response-3">
                      <ul className="ul-response-1">
                        {question.item.type_of_control === "File" && (
                          <img
                          alt="uploaded"
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
                      <img src={avatarorange} alt={"avatar"} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {window.localStorage.getItem("lastleftquestion") === "full" ? (
            <p className="submitMsg">You have answered all questions.</p>
          ) : (
            <></>
          )}
          {window.localStorage.getItem("lastleftquestion") !== "full" &&
          currentquestion ? (
            <div className="response-2">
              {Questionhandler(
                currentquestion,
                handleSubmit,
                fetched,
                checkboxhandler,
                textchangehandler,
                imageHandler,
                Errorhandler
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="inputFooter">
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
                disabled={
                  currentquestion.type_of_control !== "Text" ||
                  counter === "full"
                }
              />
              {Error && (
                <div
                  className="side"
                  style={{
                    transform: "translate3d(5px, 5px, 5px)",
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
                    place="left"
                    effect="solid"
                  >
                    <span>{Error}</span>
                  </ReactTooltip>
                </div>
              )}
              {currentquestion.type_of_control === "Textarea" && (
                <textarea
                  rows="4"
                  cols="50"
                  placeholder={currentquestion.message}
                  name={"Textarea"}
                  disabled={counter === "full"}
                  onChange={(e) => {
                    textchangehandler(e);
                  }}
                ></textarea>
              )}
              <button
                className="sendBtn"
                onClick={() => handlebutton()}
                disabled={
                  counter === "full" ||
                  currentquestion.type_of_control === "Button" ||
                  currentquestion.type_of_control === "Dropdown" 
                }
              >
                <img src={send} />
              </button>
            </>
          ) : (
            <></>
          )}

          <button className="mikeBtn">
            <img src={voice} alt="mic button" />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
