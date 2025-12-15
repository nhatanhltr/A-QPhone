
export function Validate(form , callback){

    var formValidate = document.querySelector(form)
    var totalRule = {}
    var _this = this
    var fncRule = {
        required: function(values){
            return values ? undefined : 'Vui Lòng Nhập Trường Này'
        },

        email: function(values){
            return values.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) ? undefined : 'Trường Này Không Phải Là Email'
        },

        min: function(min){
            return function(values){
                return values.length >= min ? undefined : `Mật Khẩu Tối Thiểu Phải Trên ${min} Kí Tự`
            }
        }
    }
    function getParent(elementInput){
        if(elementInput.matches('.form-group')){
            return elementInput
        }else{
            return getParent(elementInput.parentElement)
        }
    }
    function onInput(elementInput, parentInput, elementMessage){
        elementInput.oninput = function(){
            parentInput.classList.remove('invalid')
            elementMessage.innerText = ''
        }
    }
    function blurInput(elementInput){
        var ruleInput = totalRule[elementInput.name]
        var parentInput = getParent(elementInput)
        var elementMessage = parentInput.querySelector('.form-message')
        var message;
        elementInput.onblur = function(){
            for(let i=0; i<ruleInput.length; ++i){
                message = ruleInput[i](this.value)
                if(message){
                    parentInput.classList.add('invalid')
                    elementMessage.innerText = message
                    break;
                }else{
                    parentInput.classList.remove('invalid')
                    elementMessage.innerText = ''
                }
            }
        }
        onInput(elementInput, parentInput, elementMessage)
    }
    function setTotalRule(inputs){
        inputs.forEach(elementInput => {
            var rules = elementInput.getAttribute('rule')
            var rule = rules.split('|')
            rule.forEach(elementRule => {
                var fncR = fncRule[elementRule]
                if(elementRule.includes(':')){
                    var rule1 = elementRule.split(':')
                    elementRule = rule1[0]
                    fncR = fncRule[elementRule](rule1[1])
                }
                if(Array.isArray(totalRule[elementInput.name])){
                    totalRule[elementInput.name].push(fncR)
                }else{
                    totalRule[elementInput.name] = [fncR]
                }
            });
            blurInput(elementInput)
        });
    }

    function onsubmit(formValidate, inputs){
        formValidate.onsubmit = function(e){
            e.preventDefault();
            var checkSubmit = true
            inputs.forEach(element => {
                for(let i=0; i<totalRule[element.name].length; ++i){
                    var parentInput = getParent(element)
                    var elementMessage = parentInput.querySelector('.form-message')
                    var mes = totalRule[element.name][i](element.value.trim())
                    if(mes){
                        parentInput.classList.add('invalid');
                        elementMessage.innerText = mes
                        checkSubmit = false
                        break
                    }else{
                        parentInput.classList.remove('invalid')
                        elementMessage.innerText = ''
                    }
                }
                account[element.name] = element.value.trim();
            });
            if(checkSubmit){
                callback(account)
                // inputs.forEach(element => {
                //     element.value = ''
                // });
            }
        }
    }
    if(formValidate){
        var inputs = formValidate.querySelectorAll('[name][rule]')
        var account = {}
        setTotalRule(inputs)
        onsubmit(formValidate, inputs)
    }

}