// 회원가입
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 정보입력
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // 메일로 회원가입
  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // 회원가입 모달 닫기 & form 초기화
    const modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});
