import React from "react";
import UserTable from "./components/UserTable";

function App() {
  return (
    <div className="App">
      <header className="bg-dark text-white p-3 mb-4 w-100">
        <h2 className="text-center">Users Table</h2>
      </header>
      <UserTable />
    </div>
  );
}

export default App;
