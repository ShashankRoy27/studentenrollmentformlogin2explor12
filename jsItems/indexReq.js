var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "STUDENT-TABLE";
var stdRelationName = "SCHOOL-DB";
var connToken = "90931476|-31949303311004824|90960606";

$('#rollNo').focus();

function resetForm() {
    $('#rollNo').val("");
    $('#fullName').val("");
    $('#classNm').val("");
    $('#btDate').val("");
    $('#addrs').val("");
    $('#enrollD').val("");
    $('#rollNo').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollNo').focus();
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return;
    }
    var putRequest = createPUTRequest(connToken,
            jsonStrObj, stdDBName, stdRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollNo').focus();
}

function changeData() {
    $('#change').prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#rollNo').focus();

}

function getStd() {

    var rollnoJsonObj = getRollNoAsJsonObj();

    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName, rollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
    } else if (resJsonObj.status === 200) {

        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop('disabled', false);
        $("#fullName").focus();

    }
}

function validateData() {
    var rollNo = $("#rollNo").val();
    if (rollNo === "") {
        alert("Roll Number is Required");
        $("#rollNo").focus();
        return "";
    }
    var fullName = $("#fullName").val();
    if (fullName === "") {
        alert("Full Name is Required");
        $("#fullName").focus();
        return "";
    }
    var classNm = $("#classNm").val();
    if (classNm === "") {
        alert("Class is Required");
        $("#classNm").focus();
        return "";
    }
    var btDate = $("#btDate").val();
    if (btDate === "") {
        alert("Birth Date is Required");
        $("#btDate").focus();
        return "";
    }
    var addrs = $("#addrs").val();
    if (addrs === "") {
        alert("Address is Required");
        $("#addrs").focus();
        return "";
    }
    var enrollD = $("#enrollD").val();
    if (enrollD === "") {
        alert("Enroll Date is Required");
        $("#enrollD").focus();
        return "";
    }
    var jsonStrObj = {
        rollNo: rollNo,
        fullName: fullName,
        classNm: classNm,
        btDate: btDate,
        addrs: addrs,
        enrollD: enrollD
    };
    return JSON.stringify(jsonStrObj);
}



function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#fullName').val(record.fullName);
    $('#classNm').val(record.classNm);
    $('#btDate').val(record.btDate);
    $('#addrs').val(record.addrs);
    $('#enrollD').val(record.enrollD);
}

function getRollNoAsJsonObj() {
    var rollNo = $("#rollNo").val();
    var jsonStr = {
        rollNo: rollNo
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}