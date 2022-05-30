// auth 상태 변화 확인
auth.onAuthStateChanged((user) => {
  console.log("user status changed!!!");
  if (user) {
    db.collection("guides").onSnapshot(
      (snapshot) => {
        setupGuides(snapshot.docs);
        setupUI(user);
      },
      (err) => console.log(err.message)
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

// new guide 생성
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("guides")
    .add({
      title: createForm.title.value,
      content: createForm.content.value,
    })
    .then(() => {
      // 생성 모달 닫기 & form 리셋
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// 회원가입
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 유저 정보
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // 메일로 회원가입
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      // 추가 가입정보 전달 + UID 연동
      return db.collection("users").doc(cred.user.uid).set({
        bio: signupForm["signup-bio"].value,
      });
    })
    .then(() => {
      // 회원가입 모달 닫기 & form 리셋
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});

// 로그아웃
const logout = document.querySelector("#logout");
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  await auth.signOut();
  console.log("user signed out");
});

// 로그인
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 유저 정보
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // 유저 로그인
  const cred = await auth.signInWithEmailAndPassword(email, password);
  console.log(cred.user);
  // 로그인 모달 닫기 & form 리셋
  const modal = document.querySelector("#modal-login");
  M.Modal.getInstance(modal).close();
  loginForm.reset();
});
