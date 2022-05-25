// 회원가입
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 정보입력
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // 메일로 회원가입
  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    // 회원가입 모달 닫기 & form 초기화
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
