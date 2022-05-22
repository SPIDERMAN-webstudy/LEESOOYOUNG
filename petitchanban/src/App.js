function App() {
  return (
    <div className="App">
      <h1>SOOMUNITY</h1>
      <hr />
      <div className="form-wrapper">
        <input className="id" type="text" placeholder="아이디" />
        <input className="password" type="password" placeholder="비밀번호" />
        <textarea className="info" placeholder="내용"></textarea>
      </div>
    </div>
  );
}

export default App;
