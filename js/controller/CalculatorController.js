class CalculatorController {
  
  constructor() {
    this._soundKey = new Audio('click.mp3');
    this._audioOnOff = false;
    this._expression = [];
    this._lastOperator;
    this._lastNumber;
    this._display = document.querySelector('#display');
    this._btns = document.querySelectorAll('button');
    this.initialize();
  }
  
  initialize() {
    this.display = 0;
    this.getActionBtn();
    this.getActionKeys();
  }

  toggleAudio() {
    this._audioOnOff = !this._audioOnOff;
  }

  soundKeyPlay() {
    if ( this._audioOnOff ) {
      this._soundKey.currentTime = 0;
      this._soundKey.play();
    }
  }

  msgError() {
    this.display = "Error";
  }

  clearAll() {
    this._expression = [];
    this.display = 0;
  }

  isEmptyExpression() {
    return this._expression.length == 0;
  }

  lastValueExpression() {
    if ( this.isEmptyExpression() ){
      return '';
    } 
    return this._expression[this._expression.length - 1];
  }

  updateDisplay() {
    if(this.isNumber(this.lastValueExpression())) {
      this.display = this.lastValueExpression();  
    }
  }

  setLastExpression(value) {
    if ( this.isOperator(value) && value != '.' ) {
      this._expression[this._expression.length - 1] = value;
    }
    else if ( this.isNumber(value) || value == '.') {
      this._expression[this._expression.length - 1] += value.toString();
    } else {
      this.msgError();
    }
  }

  addExpression(value) {
    this._expression.push(value);
  }

  isOperator(value) {
    return ['+', '-', '*', '/', '%', '+/-', '=', '.'].indexOf(value) > -1;
  }

  isNumber(value) {
    let valueFloat = parseFloat(value);
    return (!isNaN(valueFloat));
  }

  toggleSinal() {
    if ( this.isNumber(this.lastValueExpression()) ) {
      this._expression[this._expression.length - 1] *= -1;
      this.updateDisplay();
    } else {
      this.msgError();
    }
  }

  calculatePorcent() {

    if ( this.isNumber(this.lastValueExpression()) ) {
      this._expression[this._expression.length - 1] /= 100;
      this.updateDisplay();
    } else {
      this.msgError();
    }
  }

  calculate() {

    let lengthExpression = this._expression.length;
    let result;
   
    if ( lengthExpression == 1 && !isNaN(this.lastNumber) && isNaN(this.lastOperator) ) {
      this._expression.push(this.lastOperator);
      this._expression.push(this.lastNumber);
      result = eval(this._expression.join(''));
      this.clearAll();
      this.addExpression(result.toString());
      this.updateDisplay();
    } else if ( lengthExpression == 3 ) {
      this.lastNumber = this._expression[this._expression.length - 1];
      this.lastOperator = this._expression[this._expression.length - 2];
      result = eval(this._expression.join(''));
      this.clearAll();
      this.addExpression(result.toString());
      this.updateDisplay();
    } else if (lengthExpression == 4 ) {
      this.lastOperator = this._expression.pop();
      result = eval(this._expression.join(''));
      this.clearAll();
      this.addExpression(result);
      this.updateDisplay();
      this.addExpression(this.lastOperator);
    }
  }

  treatData(value) { // 9
    if( (this.isNumber(value) && this.isOperator(this.lastValueExpression())) || this.lastValueExpression() == '' ) {
      this.addExpression(value);
      this.updateDisplay();
    } else if ( this.isOperator(value) && !this.isOperator(this.lastValueExpression()) ){
      if ( value == '.' && !this.lastValueExpression().includes('.') ) {
        this.setLastExpression(value);
        this.updateDisplay();
      } else {
        this.addExpression(value);
      }
      
    } else {
      this.setLastExpression(value);
      this.updateDisplay();
    }
  }
 
  associateValuesBtn(value) {
    this.soundKeyPlay();
    switch (value) {
      case 'C':
        this.clearAll();
        break;
      case '+/-':
        this.toggleSinal();
        break;
      case '%':
        this.calculatePorcent();
        break;
      case '=':
        this.calculate();
        break;
      case '.':
        this.treatData(value);
        break;
      case '/':
      case '+':
      case '-':
        this.treatData(value);
        this.calculate();
        break;
      case 'x':
        this.treatData('*');
        this.calculate();
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.treatData(value);
        break;
      default:
        this.msgError();
    }
  }
  
  getActionKeys() {
    document.addEventListener( 'keyup', e  => {
      let value = e.key;
      switch (value) {
        case 'Delete':
        case 'Escape':
        case 'Backspace':
          this.clearAll();
          break;
        case '%':
          this.calculatePorcent();
          break;
        case '=':
        case 'Enter':
          this.calculate();
          break;
        case '.':
        case ',':
          this.treatData(value);
          break;
        case '/':
        case '+':
        case '-':
          this.treatData(value);
          this.calculate();
          break;
        case '*':
          this.treatData('*');
          this.calculate();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.treatData(value);
          break;
      }
    });
  }

  getActionBtn() {
    this._btns.forEach( btn  => {
      btn.addEventListener('click', e => {
        if (btn.innerHTML == 'C') {
          btn.addEventListener('dblclick', e => {
            this.toggleAudio();
          });
        }
        this.associateValuesBtn(btn.innerHTML);
      });
    });
  }
  get display() {
    return this._display.value;
  }
  set display( value ) {
    this._display.value = value;
  }
  get lastOperator() {
    return this._lastOperator;
  }
  set lastOperator( value ) {
    this._lastOperator = value;
  }
  get lastNumber() {
    return this._lastNumber;
  }
  set lastNumber( value ) {
    this._lastNumber = value;
  }
}