// App.tsx
import { useState, useCallback } from "react";
import * as bithoven from "bithoven";
import CodeMirror from "@uiw/react-codemirror";
import { customKeywordHighlighting } from "./pretty";
import "./App.css";

const defaultCode = `pragma bithoven version 0.0.1;
pragma bithoven target segwit;

(condition: bool, sig_alice: signature)
(condition: bool, preimage: string, sig_bob: signature)
{
    if condition {
        older 2576085;
        return checksig (sig_alice, "0245a6b3f8eeab8e88501a9a25391318dce9bf35e24c377ee82799543606bf5212");
    } else {
        verify sha256 sha256 preimage == "53de742e2e323e3290234052a702458589c30d2c813bf9f866bef1b651c4e45f";
        return checksig (sig_bob, "0345a6b3f8eeab8e88501a9a25391318dce9bf35e24c377ee82799543606bf5212");
    }
}
`;

function App() {
  const [code, setCode] = useState<string>(defaultCode);
  const [output, setOutput] = useState<string>(
    'Click "Compile & Run" to execute the code.'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCompile = useCallback(async () => {
    setIsLoading(true);
    setOutput("Compiling...");

    try {
      const compiled = bithoven.parse_compile_analyze(code).to_object();
      setOutput(JSON.stringify(compiled, null, 2));
    } catch (error) {
      console.log(error);
      console.error("Execution error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setOutput(`❌ Error:\n\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  return (
    <div className="ideContainer">
      <header className="header">
        <h1>Bithoven Web IDE 👨‍💻</h1>
        <span className="onlineBadge">Online</span>
      </header>

      <main>
        <div className="editorSection">
          <label htmlFor="codemirror-editor">Code Editor (pretty)</label>
          <CodeMirror
            id="codemirror-editor"
            value={code}
            height="300px"
            theme="dark"
            extensions={[customKeywordHighlighting]}
            onChange={(value) => setCode(value)}
          />
        </div>

        <button
          className="compileButton"
          onClick={handleCompile}
          disabled={isLoading}
        >
          {isLoading ? "Compiling..." : "Compile & Run"}
        </button>

        <div className="outputSection">
          <label htmlFor="output">Output</label>
          <pre id="output" className="output">
            {output}
          </pre>
        </div>
      </main>
    </div>
  );
}

export default App;
