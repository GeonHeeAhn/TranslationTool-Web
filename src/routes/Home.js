import { authService } from '../fbase';
import React from 'react';
import { useHistory } from 'react-router';
import styled, {createGlobalStyle} from 'styled-components';

export default function Home(){
    const history = useHistory();
    const onLogOutClick =() => {
        authService.signOut();
        history.push("/");
    }
    return(
        <div>
            <button onClick={onLogOutClick}>log out</button>
            <div class="writing">
                <div id="original" placeholder="original"></div>
                <div id="translate" placeholder="translate">
                    연령 추정 알고리즘은 계층적 접근 방식을 실현합니다(그림 10). 첫째, 입력 조각은 18세 미만, 18-45세, 45세 이상의 세 연령 그룹으로 나누어 집니다. 둘째, 이 단계의 결과는 각각 10년 단위로 제한되는 7개의 작은 그룹으로 세분화됩니다. 따라서, 다중 클래스 분류 문제는 “일대다” 이진 분류자 집합으로 감소합니다. 따라서 이 분류자는 관련 클래스를 기반으로 이미지의 순위를 매기고, 이러한 순위 히스토그램을 분석하여 최종 결정을 내립니다.
                    이 BC들은 2단계 접근 방식을 사용하여 구성됩니다. 앞에서 설명한 대로 이미지는 적응형 특징 공간으로 처음 전환한 후 RBF 커널이 있는 지원 벡터 머신을 통해 분류됩니다.
                    입력 조각은 밝기 특성이 균일한 척도로 정렬되고 변환되도록 사전 처리됩니다. 이 사전 처리 단계에는 색상 공간 변환 및 스케일링이 포함되며, 두 작업 모두 성별 인식 알고리즘에 사용된 과정과 유사합니다. 특징은 각 색상 구성 요소에 대해 계산되고 결합되어 균일한 특징 벡터를 형성합니다.
                </div>
                <button id="infoDiv" class="tooltipDiv">Select</button>
            </div>
            <div id="detail">
                <select id="what">
                    <option value="내용 오역">내용 오역</option>
                    <option value="불필요한 첨가">불필요한 첨가</option>
                    <option value="문체 부적합">문체 부적합</option>
                </select>
                <br/>
                <div>
                    <div id="staticText">선택된 텍스트</div>
                    <textarea id="selectedNow" readonly></textarea>
                </div>
                <div>
                    <textarea id="mistranslatedDetail"></textarea>
                </div>
                <div id="buttonGroup">
                    <button id="cancel" class="detailButton">취소</button>
                    <button id="save" class="detailButton">저장</button>
                    <button id="saveChanged" class="detailButton">수정 저장</button>
                </div>
            </div>
            <div class="correction">
                <div id="correctionList">
                </div>
                <div id="chartdiv"></div>
            </div>
        </div>
    )
};
const Global = createGlobalStyle`
  textarea{
    resize: none;
  }
  body{
    margin-left: 100px;
    margin-right: 100px;
  }
  .writing{
    display: flex;
    margin-top: 10px;
    height: 350px;
  }
  #original {
    flex: 5;
    margin-right: 5px;
    border: 1px solid #b7b7b7;
  }
  #translate {
    flex: 5;
    margin-left: 5px;
    border: 1px solid #b7b7b7;
    overflow: auto;
  }
  ​
  #detail{
    border: 1px solid #b7b7b7;
    margin-top: 10px;
    height: 240px;
    position: relative;
    vertical-align: middle;
    box-sizing: content-box;
  }
  #what{
    margin-top: 10px;
    margin-left: 10px;
  }
  #selectedNow {
    height: 20px;
    width: 100%;
    border: 1px solid #b7b7b7;
    position: absolute;
    top: 50px;
    box-sizing: border-box;
    }
  #mistranslatedDetail{
    border: 1px solid #b7b7b7;
    height: 120px;
    width: 100%;
    overflow: auto;
    position: absolute;
    box-sizing: border-box;
    top: 80px;
  }
  .detailButton{
    background-color: white;
    border-radius: 5px;
    border: 1px solid gainsboro;
    float: right;
    cursor: pointer;
    width: 100px;
    top: 210px;
    right: 10px;
    position: absolute;
    box-sizing: border-box;
  }
  .detailButton:hover{
    color: white;
    border: 1px solid darkgreen;
    background-color: green;
    transition-duration: 0.5s;
    position: absolute;
    box-sizing: border-box;
  }
  #save{
    right: 120px;
  }
  #saveChanged{
    right: 230px;
  }
  ​
  .correction{
    display: flex;
    margin-top: 10px;
    height: 250px;
  }
  #correctionList {
    padding: 10px;
    flex: 5;
    margin-right: 5px;
    resize: none;
    border: 1px solid #b7b7b7;
    overflow: auto;
  }
  .item{
    margin-bottom: 10px;
    display: flex;
    height: 40px;
  }
  .name{
    flex: 5;
    padding-top: 10px;
    padding-left: 10px;
  }
  .contentIncorrect{
    background-color: #f3c300;
  }
  .contentIncorrect:hover{
    border: 1px solid #f3c300;
    background-color: #ffe167;
    transition-duration: 0.5s;
  }
  .unnecessaryAddition{
   background-color: #875692;
   color:white;
  }
  .unnecessaryAddition:hover{
    border: 1px solid #875692;
    background-color: #b77cc4;
    transition-duration: 0.5s;
  }
  .inappropriateStyle{
   background-color: #f38400;
  }
  .inappropriateStyle:hover{
    border: 1px solid #f38400;
    background-color: #ffae4d;
    transition-duration: 0.5s;
  }
  .deleteButton{
    flex: 1;
    background-color: white;
    margin-left: 10px;
    border-radius: 5px;
    border: 1px solid gainsboro;
    text-align:center;
    cursor: pointer;
  }
  .deleteButton:hover{
    color: white;
    border: 1px solid darkgreen;
    background-color: green;
    transition-duration: 0.5s;
  }
  #chartdiv {
    flex: 5;
    align-content: middle;
    line-height: middle;
    position: relative;
    width: 180px;
    height: 250px;
    border: 1px solid #b7b7b7;
    margin-left: 5px;
  }
  ​
  .tooltipDiv {
        display: none;
        width: 100px;
        background-color: #fff;
        border: 1px solid #b7b7b7;
        padding: 10px 10px 10px 10px;
  }
  .tooltipDiv:hover{
    color: white;
    border: 1px solid darkgreen;
    background-color: green;
    transition-duration: 0.5s;
  }
`;
