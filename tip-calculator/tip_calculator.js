var $ = function (id) {
    return document.getElementById(id);
}

var calculateTip = function () {
    var billAmt = $("bill_amt").value;
    var serviceQual = $("service_qual").value;
    var numOfPeople = $("ppl_amt").value;
    var msg = "";
    var errorFoundFlag = 'N'

    if (billAmt == "" || serviceQual == 0) {
        $("billAmt_error").innerHTML = "Please enter value";
        errorFoundFlag = 'Y';
    }
    else {
        $("billAmt_error").innerHTML = "";
    }

    if (errorFoundFlag == 'N')
    {
        var total = (billAmt * serviceQual) / numOfPeople;
        total = total.toFixed(2);

        msg += "TIP AMOUNT <br>$" + total;

        if (!(numOfPeople == "" || numOfPeople <= 1)) {
            msg += " each";
            $("msg").innerHTML = msg;
        }
        else {
            $("msg").innerHTML = msg;
        }
    }
    else {
        $("msg").innerHTML = "";
    }
}

window.onload = function ()
{
  $("calculate").onclick = calculateTip;
}
