// auth 상태 변화 확인
auth.onAuthStateChanged(user => {
  if (user) {
    console.log('user logged in: ', user);
  } else {
    console.log('user logged out');
  }
})

// 회원가입
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 유저 정보
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // 메일로 회원가입
  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    // 회원가입 모달 닫기 & form 리셋
    const modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// 로그아웃
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("user signed out");
  });
});

// 로그인
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 유저 정보
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // 유저 로그인
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // 로그인 모달 닫기 & form 리셋
    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});