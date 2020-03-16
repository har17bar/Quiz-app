import React, { Component } from "react";
import classes from "./QuizCreator.css";
import Button from "../../components/UI/Button/Button";
import {
  createControl,
  validate,
  validateForm
} from "../../form/formFramework";
import Input from "../../components/UI/Input/Input";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Select from "../../components/UI/Select/Select";
import { connect } from "react-redux";
import {
  createQuizQuestion,
  finishQuizQuestion
} from "../../store/actions/create";

function crateOptionControl(number) {
  return createControl(
    {
      label: `Вариант ${number}`,
      errorMessage: "Значения не мжоет быть пустым",
      id: number
    },
    { required: true }
  );
}

function createFormControls() {
  return {
    question: createControl(
      {
        label: "Ввидите вопрос",
        errorMessage: "Вопрос не может быть пустым"
      },
      { required: true }
    ),
    option1: crateOptionControl(1),
    option2: crateOptionControl(2),
    option3: crateOptionControl(3),
    option4: crateOptionControl(4)
  };
}

class QuizCreator extends Component {
  state = {
    rightAnswerId: 1,
    isFormValid: false,
    formControls: createFormControls()
  };
  onSubmitHandler = event => {
    event.preventDefault();
  };
  addQuestionHandler = event => {
    event.preventDefault();
    const {
      question,
      option1,
      option2,
      option3,
      option4
    } = this.state.formControls;
    const questionItem = {
      question: question.value,
      id: this.props.quiz.length + 1,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        { text: option1.value, id: option1.id },
        { text: option2.value, id: option2.id },
        { text: option3.value, id: option3.id },
        { text: option4.value, id: option4.id }
      ]
    };
    this.props.createQuizQuestion(questionItem);
    this.setState({
      rightAnswerId: 1,
      isFormValid: false,
      formControls: createFormControls()
    });
  };
  createQuizHandler = event => {
    event.preventDefault();
    this.setState({
      quiz: [],
      rightAnswerId: 1,
      isFormValid: false,
      formControls: createFormControls()
    });
    this.props.finishQuizQuestion();
  };
  changeHandler = (value, controlName) => {
    const formControls = { ...this.state.formControls };
    const control = { ...formControls[controlName] };

    control.touched = true;
    control.value = value;
    control.valid = validate(control.value, control.validation);

    formControls[controlName] = control;

    this.setState({
      formControls,
      isFormValid: validateForm(formControls)
    });
  };
  selectChangeHandler = event => {
    this.setState({
      rightAnswerId: +event.target.value
    });
  };
  renderControls() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName];
      return (
        <Auxiliary key={controlName + index}>
          <Input
            label={control.label}
            value={control.value}
            valid={control.valid}
            touched={control.touched}
            shouldValidate={!!control.validation}
            errorMessage={control.errorMessage}
            onChange={event =>
              this.changeHandler(event.target.value, controlName)
            }
          />
          {index === 0 ? <hr /> : null}
        </Auxiliary>
      );
    });
  }

  render() {
    const select = (
      <Select
        lable="Выбирите правилный ответ"
        value={this.state.rightAnswerId}
        onChange={this.selectChangeHandler}
        options={[
          { text: "1", value: 1 },
          { text: "2", value: 2 },
          { text: "3", value: 3 },
          { text: "4", value: 4 }
        ]}
      />
    );
    return (
      <div className={classes.QuizCreator}>
        <div>
          <h1>Создания теста</h1>
          <form onSubmit={this.onSubmitHandler}>
            {this.renderControls()}
            {select}
            <Button
              type="primary"
              onClick={this.addQuestionHandler}
              disabled={!this.state.isFormValid}
            >
              Довбавить вопрос
            </Button>

            <Button
              type="success"
              onClick={this.createQuizHandler}
              disabled={!this.props.quiz.length}
            >
              Создать тест
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quiz: state.create.quiz
  };
}
function mapDispatchToProps(dispatch) {
  return {
    createQuizQuestion: item => dispatch(createQuizQuestion(item)),
    finishQuizQuestion: () => dispatch(finishQuizQuestion())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator);
