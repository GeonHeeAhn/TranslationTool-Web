import jQuery from 'jquery';
import $ from 'jquery';
import React from 'react';

class Script extends React.Component {

    componentDidMount() {
        jQuery.each(jQuery('textarea[data-autoresize]'), function() { 
            var offset = this.offsetHeight - this.clientHeight; 
            var resizeTextarea = function(el) { 
                jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset); 
            }; 
            jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize'); 
        });
        var saveCorrection = [];
        var selected= "";
        var indexArray = [];
        var correctionListNumber = 0;
        var sliceIndex = 0;
        var clickedNameId = "";
        var clickedButtonId = "";
                
            //tooltip bar
            function getSelectedText() {
              var text = "";
              if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
              } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
                text = document.selection.createRange().text;
              }
              return text;
            }
        
            function doSomethingWithSelectedText() {
              var selectedText = getSelectedText();
              if (selectedText) {
        
                $('#infoDiv').css('display', 'block');
                $('#infoDiv').css('position', 'absolute');
                $('#infoDiv').css('left', event.clientX + 10);
                $('#infoDiv').css('top', event.clientY + 15);
              } else {
                $('#infoDiv').css('display', 'none');
              };
            };
        
            document.onmouseup = doSomethingWithSelectedText;
            document.onkeyup = doSomethingWithSelectedText;
        
            //select button click
            $("#infoDiv").click(function(){
              window.selected = document.getSelection();
              document.getElementById('selectedNow').innerHTML = selected;
                
              //To get start index
              var temp1 = selected.anchorOffset;
              // To get end index
              var temp2 = selected.focusOffset;
              var temp3 = {start: temp1, end: temp2};
              var cloneObj = JSON.parse(JSON.stringify(temp3));
              indexArray.push(cloneObj);
            });
        
        //save button
        $("#save").click(function(){
          //get selectBoxContent, selectedText, content, index
          var selectBoxTemp = document.getElementById("what");
          var selectBoxTemp = selectBoxTemp.options[selectBoxTemp.selectedIndex].value;
          var selectedTextTemp = document.getElementById("selectedNow").value;
          var contentTemp = document.getElementById("mistranslatedDetail").value;
        
          //save selectBoxContent, selectedText, content, index
          var temp = {selectBox: selectBoxTemp, selectedText: selectedTextTemp, content: contentTemp};
          saveCorrection.push(temp);
          correctionListNumber++;
        
          //add element to correctionList
          addElementToCorrectionList();
          saveCorrection[correctionListNumber - 1].number = correctionListNumber;
          
          //changable when name clicked
          $(".name").click(function(){
            clickedNameId = $(this).attr("id");
            var contentTemp = saveCorrection[parseInt(clickedNameId) - 1].content;
            document.getElementById("mistranslatedDetail").value = contentTemp;
        
            var getTempSelectedText = saveCorrection[parseInt(clickedNameId) - 1].selectedText;
            document.getElementById("selectedNow").value = getTempSelectedText;
          });
        });
        
        function addElementToCorrectionList(){
          //add item
          var item = document.createElement('div');
          item.setAttribute("style", "margin-bottom: 10px;display: flex;height: 40px;");
          item.className = "item";
        
          //add name and color to saved elements
          var name = document.createElement('div');
          name.innerHTML = correctionListNumber + ". " + saveCorrection[correctionListNumber - 1].selectBox;
          name.className = "name";
          name.setAttribute("id", correctionListNumber);
          if(saveCorrection[correctionListNumber -1].selectBox === "내용 오역"){
            name.className += " contentIncorrect";
          }
          else if(saveCorrection[correctionListNumber -1].selectBox === "불필요한 첨가"){
            name.className += " unnecessaryAddition";
          }
          else{
            name.className += " inappropriateStyle";
          }
          item.appendChild(name);
        
          //add deleteButton
          var deleteButton = document.createElement('BUTTON');
          deleteButton.innerHTML = "삭제";
          deleteButton.className = "deleteButton";
          deleteButton.setAttribute("id", correctionListNumber);
          item.appendChild(deleteButton);
        
          document.getElementById('correctionList').appendChild(item);
        }
        
        $("#saveChanged").click(function(){
          var contentTemp = document.getElementById("mistranslatedDetail").value;
          saveCorrection[clickedNameId - 1].content = contentTemp;
        });
        
        $(".deleteButton").click(function(){
          clickedButtonId = $(this).attr("id");
          saveCorrection.splice(parseInt(clickedButtonId) - 1, 1);
          correctionListNumber--;
        });
    }
}

export default Script;