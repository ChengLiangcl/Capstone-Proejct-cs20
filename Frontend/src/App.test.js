import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import Signup from "./components/Signup";
import { MemoryRouter } from "react-router-dom";
import { ConfigureStore } from "./redux/configureStore";
import { Provider } from "react-redux";
import React from "react";
import userEvent from "@testing-library/user-event";
import http from "./server/baseUrl";
import Login from "./components/login";
import LoginContainner from "./components/LoginComponent";
import Sidebar from './components/SidebarComponent';
import Main from './components/MainComponent';
import ConnectionUpload from './components/ConnectionUploading';
import ForgetPassword from "./components/ForgetPasswordComponent";
import Database from './components/DatabaseComponent';
import SOMModel from './components/ModelComponent';
import AllDataset from './components/AlldatasetsComponent';
import AllModel from './components/AllModelsComponents';
import DeleteOneDataset from './components/DeleteOneDataset';
import DeleteOneModel from './components/DeleteOneModel';
import ModelBriefInfo from './components/ModelBriefInfo';
import MetadataForm from './components/MetadataForm';
import DetailedDataset from './components/DetailedDatasetComponent';
import DatasetUploading from './components/Modal/DatasetUploading';
import DatasetUpload from './components/DatasetUploadComponent';
import ConnectionUploading from './components/Modal/ConnectionUploading';
import ModelBinding from './components/Modal/BindModel';
import AllBindedDatasets from './components/Modal/AllBindedDataset';
import BindedDatasets from './components/Modal/BindedDatasets';
import DownloadFile from './components/Modal/downloadFile';

import {
  testDatasets, testModels, testMetadata, testDetailedData, testEmptyMetadata,
  testBindedDataset, testNoBindedDataset
} from './testData';

let container = null;
let store = null;

Enzyme.configure({ adapter: new Adapter() });

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

/**========================================== My datasets ===================================================== */
describe("my datasets", () => {

  it("there are datasets in my datasets", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <MemoryRouter>
          <Database datasetFiles={testDatasets} isLoading={false} errMess={null}
            modelFiles={testModels} />
        </MemoryRouter>, container);
    });

    testDatasets.forEach((eachDataset) => {
      const datasetRow = screen.getByText(eachDataset.FileName).closest("tr");
      // highlight-start
      const utils = within(datasetRow);
      expect(utils.getByText(eachDataset.FileName)).toBeInTheDocument();
      expect(utils.getByText(eachDataset.BriefInfo)).toBeInTheDocument();
      expect(utils.getByText(eachDataset.Size)).toBeInTheDocument();
      // highlight-end
    });
  });

  it("there are datasets in all datasets", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <MemoryRouter>
          <Database allDatasetFiles={testDatasets} isAllLoading={false} allErrMess={null} isAllQuery={true} />
        </MemoryRouter>, container);
    });

    testDatasets.forEach((eachDataset) => {
      const allDatasetRow = screen.getByText(eachDataset.FileName).closest("tr");
      // highlight-start
      const utils = within(allDatasetRow);
      expect(utils.getByText(eachDataset.FileName)).toBeInTheDocument();
      expect(utils.getByText(eachDataset.BriefInfo)).toBeInTheDocument();
      expect(utils.getByText(eachDataset.UserName)).toBeInTheDocument();
      // highlight-end
    });
  });

  it("there is no dataset in my datasets", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <Database datasetFiles={[]} isLoading={false} errMess={null} />, container);
    });
    const nullDatasetRow = screen.getByTestId("null-table").closest("tbody");
    expect(nullDatasetRow).toBeInTheDocument();
  });

  it("there is no dataset in all datasets", () => {
    // Test first render and componentDidMount
    act(() => {
      render(<Database allDatasetFiles={[]} isAllLoading={false} allErrMess={null} isAllQuery={true} />, container);
    });

    const nullAllDatasetRow = screen.getByTestId("null-all-table").closest("tbody");
    expect(nullAllDatasetRow).toBeInTheDocument();
  });

  it("there are datasets in all datasets -- all", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <MemoryRouter>
          <AllDataset datasetFiles={testDatasets} isLoading={false} errMess={null}
            modelFiles={testModels} />
        </MemoryRouter>, container);
    });

    testDatasets.forEach((eachDataset) => {
      const datasetAllRow = screen.getByText(eachDataset.FileName).closest("tr");
      // highlight-start
      const utils = within(datasetAllRow);
      expect(utils.getByText(eachDataset.FileName)).toBeInTheDocument();
      expect(utils.getByText(eachDataset.BriefInfo)).toBeInTheDocument();
      expect(utils.getByText(eachDataset.UserName)).toBeInTheDocument();
      // highlight-end
    });
  });

  it("there is no dataset in all datasets -- all", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <AllDataset datasetFiles={[]} isLoading={false} errMess={null} />, container);
    });
    const nullDatasetRow = screen.getByTestId("null-dataset--all").closest("tbody");
    expect(nullDatasetRow).toBeInTheDocument();
  });

  describe("test metadata and data in the DetailedData Component", () => {

    it("should show corresponding metadata", () => {
      act(() => {
        render(
          <MemoryRouter>
            <DetailedDataset detailedData={testDetailedData} isLoading_detailedData={false} errMess_detailedData={null}
              metadata={testMetadata[0]} isLoading_metadata={false} errMess_metadata={null} />
          </MemoryRouter>, container);
      });
      // metadata
      expect(screen.getByText(testMetadata[0].Description)).toBeInTheDocument();
      expect(screen.getByText(testMetadata[0].Source)).toBeInTheDocument();

      testMetadata[0].AttrInfo.forEach((eachAttr) => {
        const attrTows = screen.getByText(eachAttr.attrName).closest("tr");
        const utils = within(attrTows);
        expect(utils.getByText(eachAttr.attrName)).toBeInTheDocument();
        expect(utils.getByText(eachAttr.attrDescription)).toBeInTheDocument();
      });

      // SOM data
      testDetailedData.forEach((eachRow) => {
        const detailedDataRow = screen.getByText(eachRow["Coloumn 0"]).closest("tr");
        expect(detailedDataRow).toBeInTheDocument();
      });
    });

  });

  describe("test metadata and data in the MetadataForm Component", () => {

    it("should show corresponding metadata", () => {
      act(() => {
        render(
          <MemoryRouter>
            <MetadataForm detailedData={testDetailedData} isLoading_detailedData={false} errMess_detailedData={null}
              metadata={testMetadata[0]} isLoading_metadata={false} errMess_metadata={null} />
          </MemoryRouter>, container);
      });
      // metadata
      expect(screen.getByText(testMetadata[0].Description)).toBeInTheDocument();
      expect(screen.getByText(testMetadata[0].Source)).toBeInTheDocument();

      testMetadata[0].AttrInfo.forEach((eachAttr) => {
        const attrTows = screen.getByText(eachAttr.attrName).closest("tr");
        const utils = within(attrTows);
        expect(utils.getByText(eachAttr.attrName)).toBeInTheDocument();
        expect(utils.getByText(eachAttr.attrDescription)).toBeInTheDocument();
      });

      // SOM data
      testDetailedData.forEach((eachRow) => {
        const detailedDataRow = screen.getByText(eachRow["Coloumn 0"]).closest("tr");
        expect(detailedDataRow).toBeInTheDocument();
      });

      // Metadata form
      expect(screen.getByPlaceholderText(testMetadata[0].BriefInfo)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(testMetadata[0].Description)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(testMetadata[0].Source)).toBeInTheDocument();
    });

    it("should show corresponding empty metadata", () => {
      act(() => {
        render(
          <MemoryRouter>
            <MetadataForm detailedData={testDetailedData} isLoading_detailedData={false} errMess_detailedData={null}
              metadata={testEmptyMetadata[0]} isLoading_metadata={false} errMess_metadata={null} />
          </MemoryRouter>, container);
      });
      // SOM data
      testDetailedData.forEach((eachRow) => {
        const detailedDataRow = screen.getByText(eachRow["Coloumn 0"]).closest("tr");
        expect(detailedDataRow).toBeInTheDocument();
      });

      // Metadata form
      expect(screen.getByPlaceholderText("Please input a brief description for the dataset")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Please input a detailed description for the dataset")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Please input the source")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Type and press Enter")).toBeInTheDocument();
    });

  });

  it("should toggle deletion when click the delete button", () => {
    const onChange = jest.fn()

    act(() => {
      render(<DeleteOneDataset onChange={onChange} />, container);
    });

    fireEvent.click(screen.getByTestId("delete-dataset"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should toggle uploading when click the upload button for datasets", () => {
    const onDatasetUploadChange = jest.fn()

    act(() => {
      render(<DatasetUploading onChange={onDatasetUploadChange} />, container);
    });

    fireEvent.click(screen.getByTestId("upload-dataset"));
    expect(onDatasetUploadChange).toHaveBeenCalledTimes(1);
  });

  it("should toggle model binding when click the bind button for datasets", () => {
    const onBindChange = jest.fn()

    act(() => {
      render(<ModelBinding onChange={onBindChange} modelFiles={testModels} />, container);
    });

    fireEvent.click(screen.getByTestId("binding-model"));
    expect(onBindChange).toHaveBeenCalledTimes(1);
  });

  it("a poper should be reacted when the download button is clicked", () => {
    const onChange = jest.fn()
    const onListen = jest.fn()

    act(() => {
      render(<DownloadFile onChange={onChange} onListen={onListen} datasetName={"test.dat"} />, container);
    });

    fireEvent.click(screen.getByTestId("download-selection"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("download-popper")).toBeInTheDocument();
    // test download items
    const options = ['.txt', '.dat', '.csv'];
    options.forEach((option, index) => {
      fireEvent.click(screen.getByTestId(`download-popper-${option}`));
    });
    expect(onListen).toHaveBeenCalledTimes(3);
  });

  describe("check dataset uploading", () => {
    it("selecting files and uploading buttons should be shown", () => {
      act(() => {
        render(<DatasetUpload />, container);
      });
      expect(screen.getByTestId("select-dataset")).toBeInTheDocument();
      expect(screen.getByTestId("upload-dataset-btn")).toBeInTheDocument();
    });
  });

  describe('FileUploadField', () => {
    const component = shallow(<DatasetUpload />);
    const instance = component.instance();

    it('should render a label and a file input field', () => {
      expect(component.find('input[type="file"]')).toBeTruthy();
      expect(component.find('label')).toBeTruthy();
    });

    it('should attach the label to the input field', () => {
      const id = 'file-upload';
      expect(component.find('label').prop('htmlFor')).toBe(id);
      expect(component.find('input').prop('id')).toBe(id);
    });

    it('should not show preview if no file has been selected', () => {
      expect(component.find('p')).toBeTruthy();
    });

    it('should show initial uploading message', () => {
      //expect(component.find('.uploading-notice')).toBe("Please upload your datasets");
      //instance.readFileAsDataURL(file);
      expect(component.find('.uploading-notice').text()).toBe("Please upload your datasets");
    });

    it("should show for a successful selecting files", () => {
      const files = [
        new File(['hello'], 'hello.png', { type: 'image/png' }),
        new File(["foo"], "foo.txt", { type: "text/plain", })
      ];
      const input = component.find('input');
      input.simulate('change', { target: { files: files } });
      expect(component.find('.uploading-notice').text()).toBe("Please upload your datasets");
    });

    it("should show for a successful uploading files", () => {

      const files = [
        new File(['hello'], 'hello.png', { type: 'image/png' }),
        new File(["foo"], "foo.txt", { type: "text/plain", })
      ];

      const uploadBtn = component.find('.upload-btn');
      uploadBtn.simulate('click');
      expect(component.find('.uploading-notice').text()).toBe("Please upload your datasets");
      expect(component.find('.progress-bar').prop("value")).toBe(0);
    });
  });
});


/* ======================= Model ======================= */
describe("my model", () => {

  it("there are models in my models", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <MemoryRouter>
          <SOMModel modelFiles={testModels} isLoading={false} errMess={null} />
        </MemoryRouter>, container);
    });

    testModels.forEach((eachModel) => {
      const modelRow = screen.getByText(eachModel.FileName).closest("tr");
      // highlight-start
      const utils = within(modelRow);
      expect(utils.getByText(eachModel.FileName)).toBeInTheDocument();
      expect(utils.getByText(eachModel.BriefInfo)).toBeInTheDocument();
      expect(utils.getByText(eachModel.Size)).toBeInTheDocument();
      // highlight-end
    });
  });

  it("there are models in all models", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <MemoryRouter>
          <SOMModel allModels={testModels} isAllQuery={true} />
        </MemoryRouter>, container);
    });

    testModels.forEach((eachModel) => {
      const allModelRow = screen.getByText(eachModel.FileName).closest("tr");
      // highlight-start
      const utils = within(allModelRow);
      expect(utils.getByText(eachModel.FileName)).toBeInTheDocument();
      expect(utils.getByText(eachModel.BriefInfo)).toBeInTheDocument();
      expect(utils.getByText(eachModel.UserName)).toBeInTheDocument();
      // highlight-end
    });
  });

  it("there is no model in my models", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <SOMModel modelFiles={[]} isLoading={false} errMess={null} />, container);
    });
    const nullModelRow = screen.getByTestId("null-model").closest("tbody");
    expect(nullModelRow).toBeInTheDocument();
  });

  it("there is no model in all models", () => {
    // Test first render and componentDidMount
    act(() => {
      render(<SOMModel allModels={[]} isAllQuery={true} />, container);
    });

    const nullAllModelRow = screen.getByTestId("null-all-model").closest("tbody");
    // highlight-start
    expect(nullAllModelRow).toBeInTheDocument();
    // highlight-end
  });

  it("there are models in all models -- all", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <MemoryRouter>
          <AllModel allModels={testModels} />
        </MemoryRouter>, container);
    });

    testModels.forEach((eachModel) => {
      const datasetAllRow = screen.getByText(eachModel.FileName).closest("tr");
      // highlight-start
      const utils = within(datasetAllRow);
      expect(utils.getByText(eachModel.FileName)).toBeInTheDocument();
      expect(utils.getByText(eachModel.BriefInfo)).toBeInTheDocument();
      expect(utils.getByText(eachModel.UserName)).toBeInTheDocument();
      // highlight-end
    });
  });

  it("there is no model in all modelss -- all", () => {
    // Test first render and componentDidMount
    act(() => {
      render(
        <AllModel allModels={[]} />, container);
    });
    const nullModelRow = screen.getByTestId("null-model--all").closest("tbody");
    expect(nullModelRow).toBeInTheDocument();
  });

  it("should toggle deletion when click the delete button for a model", () => {
    const onModelChange = jest.fn()

    act(() => {
      render(<DeleteOneModel onChange={onModelChange} />, container);
    });

    fireEvent.click(screen.getByTestId("delete-model"));
    expect(onModelChange).toHaveBeenCalledTimes(1);
  })

  it("should toggle briefInfo when click the modify button for a model", () => {
    const onModelBriefInfoChange = jest.fn()

    act(() => {
      render(<ModelBriefInfo onChange={onModelBriefInfoChange} />, container);
    });

    fireEvent.click(screen.getByTestId("modify-model-briefInfo"));
    expect(onModelBriefInfoChange).toHaveBeenCalledTimes(1);
  });

  it("should toggle uploading when click the upload button for a model", () => {
    const onModelUploadChange = jest.fn()

    act(() => {
      render(<ConnectionUploading onChange={onModelUploadChange}
        connectionFiles={["this is for a uploaded model", ["this is for uploaded datasets"]]} />, container);
    });

    fireEvent.click(screen.getByTestId("model-upload"));
    expect(onModelUploadChange).toHaveBeenCalledTimes(1);

  });

  describe("check a binded model and its related dataset", () => {
    it("Breadcrumb and a table should be shown in the all model's binded page", () => {
      act(() => {
        render(
          <MemoryRouter>
            <AllBindedDatasets bindedDatasets={testNoBindedDataset} />
          </MemoryRouter>, container);
      });

      expect(screen.getByTestId("Binded-Breadcrumb")).toBeInTheDocument();

      testNoBindedDataset.forEach((eachModel) => {
        const bindedDatasetAllRow = screen.getByText(eachModel.FileName).closest("tr");
        // highlight-start
        const utils = within(bindedDatasetAllRow);
        expect(utils.getByText(eachModel.FileName)).toBeInTheDocument();
        expect(utils.getByText(eachModel.BriefInfo)).toBeInTheDocument();
        // highlight-end
      });
    });

    it("Breadcrumb and a table should be shown in the my model's binded page", () => {
      act(() => {
        render(
          <MemoryRouter>
            <BindedDatasets bindedDatasets={testNoBindedDataset} />
          </MemoryRouter>, container);
      });

      expect(screen.getByTestId("my-binded-Breadcrumb")).toBeInTheDocument();

      testNoBindedDataset.forEach((eachModel) => {
        const bindedDatasetAllRow = screen.getByText(eachModel.FileName).closest("tr");
        // highlight-start
        const utils = within(bindedDatasetAllRow);
        expect(utils.getByText(eachModel.FileName)).toBeInTheDocument();
        expect(utils.getByText(eachModel.BriefInfo)).toBeInTheDocument();
        // highlight-end
      });
    });
  });

  describe('FileUploadField', () => {
    const component = shallow(<ConnectionUpload connectionFiles={["this is for a uploaded model", ["this is for uploaded datasets"]]} />);
    const instance = component.instance();

    it('should render a label and a file input field', () => {
      expect(component.find('input[type="file"]')).toBeTruthy();
      expect(component.find('label')).toBeTruthy();
    });

    it('should render a card for uploading info', () => {
      expect(component.find(".uploading-info")).toBeTruthy();
      expect(component.find('h5')).toBeTruthy();
      expect(component.find('strong')).toBeTruthy();
      expect(component.find('#model-info').text()).toBeTruthy();
      expect(component.find('#dataset-info').text()).toBeTruthy();
    });

    it('should not show preview if no file has been selected', () => {
      expect(component.find('p')).toBeTruthy();
    });

    it('should show initial uploading message', () => {
      expect(component.find('.uploading-notice').text()).toBe("Please upload your datasets.");
    });

    it("should show for a successful selecting model", () => {

      const files = [
        new File(['hello'], 'hello.png', { type: 'image/png' }),
        new File(["foo"], "foo.txt", { type: "text/plain", })
      ];
      const modelInput = component.find('input.model-upload');
      modelInput.simulate('change', { target: { files: files } });
      expect(component.find('.uploading-notice-model').text()).toBe("Please upload your model.");
    });

    it("should show for a successful selecting datasets", () => {

      const files = [
        new File(['hello'], 'hello.png', { type: 'image/png' }),
        new File(["foo"], "foo.txt", { type: "text/plain", })
      ];
      const datasetInput = component.find('.dataset-upload');
      datasetInput.simulate('change', { target: { files: files } });
      expect(component.find('.uploading-notice').text()).toBe("Please upload your datasets.");
    });

    it("should show for a successful uploading files", () => {

      const files = [
        new File(['hello'], 'hello.png', { type: 'image/png' }),
        new File(["foo"], "foo.txt", { type: "text/plain", })
      ];

      const uploadBtn = component.find('.upload-btn');
      uploadBtn.simulate('click');
      expect(component.find('.uploading-notice').text()).toBe("Please upload your datasets.");

    });
  });

});

/* ======================= User Registration & Login ======================= */
//https://ovpv.me/unit-testing-functional-components-jest-enzyme/
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
    });
  });

  describe("loginContainer", () => {
    const loginWrapper = shallow(<LoginContainner />);

    it("should show tabs for log in and sign up after mounting", () => {
      expect(loginWrapper.find('#simple-tabpanel-0')).toBeTruthy();
      expect(loginWrapper.find('#simple-tabpanel-1')).toBeTruthy();
      expect(loginWrapper.find(Login)).toBeTruthy();
      expect(loginWrapper.find(Signup)).toBeTruthy();
    });
  })

    describe("forget password", () => {
      describe("forget password component render", () => {
        let username, password, confirmPassword, question, answer, submitButton, backToLogin;

        beforeEach(() => {
          act(() => {
            render((
              <Provider store={store}>
                <MemoryRouter>
                  <ForgetPassword />
                </MemoryRouter>
              </Provider>
            ), container);
          });
          username = container.querySelector("#outlined-search")
          password = container.querySelector("#outlined-password-input")
          confirmPassword = container.querySelector("#outlined-confirmpassword-input")
          question = container.querySelector("#outlined-question-input")
          answer = container.querySelector("#outlined-answer-input")
          submitButton = container.querySelector("#outlined-submit-button")
          backToLogin = container.querySelector("#outlined-back-button")
        });

        afterEach(() => {
          username.remove();
          password.remove();
          confirmPassword.remove();
          question.remove();
          answer.remove();
          submitButton.remove();
          backToLogin.remove();
          username = undefined;
          password = undefined;
          confirmPassword = undefined;
          question = undefined;
          answer = undefined;
          submitButton = undefined;
          backToLogin = undefined;
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
            submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          });

          expect(username.parentNode.nextSibling.innerHTML).toMatch(/Required/);
        });

        it("sign up without password", async () => {
          userEvent.type(username, 'jack');
          userEvent.type(confirmPassword, '12345678');
          userEvent.type(question, 'What is your mother name');
          userEvent.type(answer, 'Julie');

          await act(async () => {
            submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
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
            submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          });

          expect(password.parentNode.nextSibling.innerHTML).toMatch(/The password length should be at least 8 digits/);
        });

        it("sign up without confirm password", async () => {
          userEvent.type(username, 'John');
          userEvent.type(password, 'qazwsxedc');
          userEvent.type(question, 'What is your mother name');
          userEvent.type(answer, 'Julie');

          await act(async () => {
            submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
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
            submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          });

          expect(confirmPassword.parentNode.nextSibling.innerHTML).toMatch(/Password not matched/);
        });

        it("sign up without answer", async () => {
          userEvent.type(username, 'John');
          userEvent.type(password, 'qazwsxedc');
          userEvent.type(confirmPassword, 'qazwsxedc');
          userEvent.type(question, 'What is your mother name');

          await act(async () => {
            submitButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          });

          expect(answer.parentNode.nextSibling.innerHTML).toMatch(/Required/);
        });
      });
    });
});

/**=======================Visualisation======================================= */

/**======================= Side bar ==================================== */
// describe("side bar component", () => {

//   it("should render all elements needed", () => {
//     act(() => {
//       render((
//         <Sidebar />
//       ), container);
//     })
//   })
//});


// /* ======================= Model ======================= */
// describe("My models", () => {
//   describe("my models component render", () => {
//     let searchInput, searchButton, modelTable;

//     beforeEach(() => {
//       act(() => {
//         render((
//             <Provider store={store}>
//               <MemoryRouter initialEntries={["/mymodels"]}>
//                 <Main />
//               </MemoryRouter>
//             </Provider>
//         ), container);

//         searchInput = document.querySelector("[placeholder='Search models here']");
//         searchButton = document.querySelector("button[type='button']");
//         modelTable = document.querySelector('table');
//       });
//     });

//     afterEach(() => {
//       searchInput.remove();
//       searchButton.remove();
//       modelTable.remove();
//       searchInput = null;
//       searchButton = null;
//       modelTable = null;
//     })

//     it("should contain search input text field and search button", () => {
//       expect(searchInput).not.toBeNull();
//       expect(searchButton).not.toBeNull();
//     });

//     it("the user models list is response correctly", async () => {
//       const response = await http.post('/modelFiles', JSON.stringify('jwan'));
//       expect(response.status).toBe(200);
//       expect(response.data).toBeInstanceOf(Array);
//     });

//     it("the user models list is response correctly by search models", async () => {
//       const response = await http.post('/query-models', JSON.stringify(['ex', 'jwan']));
//       expect(response.status).toBe(200);
//       expect(response.data).toBeInstanceOf(Array);
//     });

//     it("edit model description", async () => {
//       const body = {
//         description: "sadasd",
//         modelName: "ex.cod",
//         userName: "jwan",
//       };
//       const response = await http.post('/edit-model-desc', JSON.stringify(body));
//       expect(response.status).toBe(200);
//       expect(response.data).toBe('ex.cod');
//     });

//     it("get umatrix databsets", async () => {
//       const response = await http.post('/get-umatrixDatasets', JSON.stringify(["ex.cod", "jwan"]));
//       expect(response.status).toBe(200);
//       expect(response.data).toBe(Array);
//     });

//     it("upload error model format file", async () => {
//       const formData = new FormData();
//       formData.append('username', 'jwan');
//       formData.append('model', new File([new Blob()], "errorFilename.txt"));

//       const response = await http.post('/connect-upload', formData);
//       expect(response.status).toBe(500);
//     });
//   });
// });
