import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import run from "../Config/gemini"; // Ensure you import 'run' correctly

export const Context = createContext();

const ContextProvider = ({ children }) => {
  // destructure 'children' prop
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState(() => {
    // Load `prevPrompts` from localStorage on initial load
    const storedPrompts = localStorage.getItem("prevPrompts");
    return storedPrompts ? JSON.parse(storedPrompts) : [];
  }); // Initialize as an empty array
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  useEffect(() => {
    localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
  }, [prevPrompts]);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }
    // setRecentPrompt(input);
    // setPrevPrompts((prev) => [...prev, input]); // Update prevPrompts

    try {
      //const response = await run(input); // Call 'run' function here
      let responseArray = response.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }

      let newResponse2 = newResponse.split("*").join("<br>");
      let newResponseArray = newResponse2.split(" ");

      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

// Add PropTypes validation for 'children' prop
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is required
};

export default ContextProvider;
