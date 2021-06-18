import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Signup from "./components/Signup";
import { MemoryRouter } from "react-router-dom";
import { ConfigureStore } from "./redux/configureStore";
import {Provider} from "react-redux";
import React from "react";
import userEvent from "@testing-library/user-event";
import http from "./server/baseUrl";
import Login from "./components/login";
import Main from './components/MainComponent';

let container = null;
let store = null;

beforeEach(() => {
  container = document.createElement("div");
  store = ConfigureStore();
  document.body.appendChild(container);
});

afterEach(() => {
  store = null;
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

/* ======================= User Registration & Login ======================= */
describe("user", () => {
  describe("signup", () => {
    describe("signup component render", () => {
      let username, password, confirmPassword, question, answer, signUpButton;

      beforeEach(() => {
        act(() => {
          render((
              <Provider store={store}>
                <MemoryRouter>
                  <Signup />
                </MemoryRouter>
              </Provider>
          ), container);
        });
        username = container.querySelector("#outlined-email-input")
        password = container.querySelector("#outlined-password-input")
        confirmPassword = container.querySelector("#outlined-confirmpassword-input")
        question = container.querySelector("#outlined-question-input")
        answer = container.querySelector("#outlined-answer-input")
        signUpButton = container.querySelector("#outlined-signup-button")
      });

      afterEach(() => {
        username.remove();
        password.remove();
        confirmPassword.remove();
        question.remove();
        answer.remove();
        signUpButton.remove();
        username = undefined;
        password = undefined;
        confirmPassword = undefined;
        question = undefined;
        answer = undefined;
        signUpButton = undefined;
      });

      it("should contain all sign up input text field and submit button", () => {
        expect(username).not.toBeNull();
        expect(password).not.toBeNull();
        expect(confirmPassword).not.toBeNull();
        expect(question).not.toBeNull();
        expect(answer).not.toBeNull();
        expect(answer).not.toBeNull();
      });

      it("sign up without username", async () => {
        userEvent.type(password, '12345678');
        userEvent.type(confirmPassword, '12345678');
        userEvent.type(question, 'What is your mother name');
        userEvent.type(answer, 'Julie');

        await act(async () => {
          signUpButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(username.parentNode.nextSibling.innerHTML).toMatch(/Required/);
      });

      it("sign up without password", async () => {
        userEvent.type(username, 'jack');
        userEvent.type(confirmPassword, '12345678');
        userEvent.type(question, 'What is your mother name');
        userEvent.type(answer, 'Julie');

        await act(async () => {
          signUpButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(password.parentNode.nextSibling.innerHTML).toMatch(/Required/);
      });

      it("sign up with the password less than 8 digits", async () => {
        userEvent.type(username, 'John');
        userEvent.type(password, 'abc');
        userEvent.type(confirmPassword, 'abc');
        userEvent.type(question, 'What is your mother name');
        userEvent.type(answer, 'Julie');

        await act(async () => {
          signUpButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(password.parentNode.nextSibling.innerHTML).toMatch(/The password length should be at least 8 digits/);
      });

      it("sign up without confirm password", async () => {
        userEvent.type(username, 'John');
        userEvent.type(password, 'qazwsxedc');
        userEvent.type(question, 'What is your mother name');
        userEvent.type(answer, 'Julie');

        await act(async () => {
          signUpButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(confirmPassword.parentNode.nextSibling.innerHTML).toMatch(/Required/);
      });

      it("sign up with confirm password not matched password", async () => {
        userEvent.type(username, 'John');
        userEvent.type(password, 'qazwsxedc');
        userEvent.type(confirmPassword, 'abcdfsdf');
        userEvent.type(question, 'What is your mother name');
        userEvent.type(answer, 'Julie');

        await act(async () => {
          signUpButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(confirmPassword.parentNode.nextSibling.innerHTML).toMatch(/Password not matched/);
      });

      it("sign up without answer", async () => {
        userEvent.type(username, 'John');
        userEvent.type(password, 'qazwsxedc');
        userEvent.type(confirmPassword, 'qazwsxedc');
        userEvent.type(question, 'What is your mother name');

        await act(async () => {
          signUpButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(answer.parentNode.nextSibling.innerHTML).toMatch(/Required/);
      });

      it("sign up request backend API", async () => {
        const body = {
          email: 'John_' + Math.ceil(Math.random() * 99999999),
          password: '12345678',
          confirmpassword: '12345678',
          question: 'What is your mother name',
          answer: 'test name'
        };
        const response = await http.post('/sign-up', JSON.stringify(body));
        expect(response.status).toBe(200);
        expect(response.data).toBe("Add Sucessfully");
      });

      it("sign up with duplicate username", async () => {
        const body = {
          email: 'John',
          password: '12345678',
          confirmpassword: '12345678',
          question: 'What is your mother name',
          answer: 'test name'
        };
        const response = await http.post('/sign-up', JSON.stringify(body));
        expect(response.status).toBe(200);
        expect(response.data).toBe("username already exist");
      });
    });
  });

  describe("login", () => {
    describe("login component render", () => {
      let username, password, loginButton;

      beforeEach(() => {
        act(() => {
          render((
              <Provider store={store}>
                <MemoryRouter>
                  <Login />
                </MemoryRouter>
              </Provider>
          ), container);
        });
        username = container.querySelector("#outlined-search")
        password = container.querySelector("#outlined-password-input")
        loginButton = container.querySelector("#outlined-login-button")
      });

      afterEach(() => {
        username.remove();
        password.remove();
        loginButton.remove();
        username = undefined;
        password = undefined;
        loginButton = undefined;
      });

      it("should contain all login input text field and submit button", () => {
        expect(username).not.toBeNull();
        expect(password).not.toBeNull();
        expect(loginButton).not.toBeNull();
      });

      it("login without username", async () => {
        userEvent.type(password, '12345678');

        await act(async () => {
          loginButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(username.parentNode.nextSibling.innerHTML).toMatch(/Required/);
      });

      it("login without password", async () => {
        userEvent.type(username, 'John');

        await act(async () => {
          loginButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(password.parentNode.nextSibling.innerHTML).toMatch(/Required/);
      });

      it("login with invalid username or password", async () => {
        const body = {
          username: 'John',
          password: 'errorpassword',
        };
        const response = await http.post('/login', JSON.stringify(body));
        expect(response.status).toBe(200);
        expect(response.data).toBe("Invalid login credentials");
      });

      it("login with correct invalid username or password", async () => {
        const body = {
          username: 'John',
          password: '12345678',
        };
        const response = await http.post('/login', JSON.stringify(body));
        expect(response.status).toBe(200);
        expect(response.data).toBe("John");
      });
    });
  });
});


/* ======================= User Registration & Login ======================= */
describe("My models", () => {
  describe("my models component render", () => {
    let searchInput, searchButton, modelTable;

    beforeEach(() => {
      act(() => {
        render((
            <Provider store={store}>
              <MemoryRouter initialEntries={["/mymodels"]}>
                <Main />
              </MemoryRouter>
            </Provider>
        ), container);

        searchInput = document.querySelector("[placeholder='Search models here']");
        searchButton = document.querySelector("button[type='button']");
        modelTable = document.querySelector('table');
      });
    });

    afterEach(() => {
      searchInput.remove();
      searchButton.remove();
      modelTable.remove();
      searchInput = null;
      searchButton = null;
      modelTable = null;
    })

    it("should contain search input text field and search button", () => {
      expect(searchInput).not.toBeNull();
      expect(searchButton).not.toBeNull();
    });

    it("the user models list is response correctly", async () => {
      const response = await http.post('/modelFiles', JSON.stringify('jwan'));
      expect(response.status).toBe(200);
      expect(response.data).toBeInstanceOf(Array);
    });

    it("the user models list is response correctly by search models", async () => {
      const response = await http.post('/query-models', JSON.stringify(['ex', 'jwan']));
      expect(response.status).toBe(200);
      expect(response.data).toBeInstanceOf(Array);
    });

    it("edit model description", async () => {
      const body = {
        description: "sadasd",
        modelName: "ex.cod",
        userName: "jwan",
      };
      const response = await http.post('/edit-model-desc', JSON.stringify(body));
      expect(response.status).toBe(200);
      expect(response.data).toBe('ex.cod');
    });

    it("get umatrix databsets", async () => {
      const response = await http.post('/get-umatrixDatasets', JSON.stringify(["ex.cod", "jwan"]));
      expect(response.status).toBe(200);
      expect(response.data).toBe(Array);
    });

    it("upload error model format file", async () => {
      const formData = new FormData();
      formData.append('username', 'jwan');
      formData.append('model', new File([new Blob()], "errorFilename.txt"));

      const response = await http.post('/connect-upload', formData);
      expect(response.status).toBe(500);
    });
  });
});


/*
https://reactjs.org/docs/testing-recipes.html
https://create-react-app.dev/docs/running-tests/
https://jestjs.io/docs/tutorial-react
*/
