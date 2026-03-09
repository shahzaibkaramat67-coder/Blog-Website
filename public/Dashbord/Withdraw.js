 const methodToWithdraw = document.getElementById("method");
  const accountDetails = document.getElementById("accountDetails");

  methodToWithdraw.addEventListener("change", function () {
    const method = this.value;

    // ["bank", "easypaisa", "jazzcash", "payoneer", "sadapay"],

    if (method === "easypaisa" || method === "jazzcash") {
      accountDetails.placeholder = "Enter Mobile Number (03XXXXXXXXX)";
      accountDetails.type = "tel"

    }
    else if (method === "payoneer" || method === "sadapay") {
      accountDetails.placeholder = "Enter registered email address";
      accountDetails.type = "text"

    }
    else {
      accountDetails.placeholder = "Enter Account Details";
      accountDetails.type = "text"

    }
  })
