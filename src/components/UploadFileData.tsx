import React, { useState } from "react";

interface Props {}

const UploadFileData = () => {
  const [uniqueKey, setUniqueKey] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState("text");

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {};

  return (
    <div className="w-full flex flex-col justify-center items-center mt-20">
      <div className="m-4 flex flex-row gap-5 items-center justify-between w-[40%]">
        <label>Enter the unique key</label>
        <input
          type="text"
          placeholder="Enter the unique key"
          className="rounded-md p-2 border-2 w-[70%]"
          value={uniqueKey}
          onChange={(e) => setUniqueKey(e.target.value)}
        />
      </div>
      <div className="m-4 flex flex-row gap-5 justify-between items-start w-[40%]">
        <label>Choose the input type</label>
        <div className="w-[20%] flex flex-row justify-between">
          <label className="inline-flex items-center mb-2">
            <input
              type="radio"
              name="option"
              value="text"
              checked={selectedOption === "text"}
              onChange={handleOptionChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Text</span>
          </label>

          <label className="inline-flex items-center mb-2">
            <input
              type="radio"
              name="option"
              value="file"
              checked={selectedOption === "file"}
              onChange={handleOptionChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">File</span>
          </label>
        </div>
      </div>
      <div className="w-[40%]">
        <div className="mt-4 w-full">
          {selectedOption === "text" ? (
            <textarea
              className="border border-gray-300 rounded-md p-2 w-full h-32 resize-none"
              placeholder="Enter your text here"
            />
          ) : (
            <input
              type="file"
              className="block w-full text-gray-700 border border-gray-300 rounded-md cursor-pointer bg-white"
              accept=".txt,.pdf,.doc,.docx"
            />
          )}
        </div>
      </div>
      <div className="mt-10">
        <button
          className="cursor-pointer bg-cyan-700 p-3 rounded-md hover:bg-cyan-900 transition-colors text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadFileData;
