alert("Make payment towards your balance");
// Create a Stripe client.
var stripe = Stripe("pk_test_yI6L3SxpkNK86IpwN2y7c1FK");
let balance = 387;
// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: "#32325d",
    lineHeight: "18px",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

// Create an instance of the card Element.
var card = elements.create("card", { style: style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount("#card-element");

// Handle real-time validation errors from the card Element.
card.addEventListener("change", function(event) {
  var displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

// Handle form submission.
var form = document.getElementById("payment-form");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById("card-errors");
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token.id);
    }
  });
});

function stripeTokenHandler(token) {
  const amountEl = document.querySelector("#amount");
  const amount = amountEl ? amountEl.value : balance;

  fetch("https://infinite-savannah-84248.herokuapp.com/charge", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      token: token,
      amount: amount
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("data", data);
      let alertBalance = document.querySelector(".alert");
      alertBalance.innerText = `Successfully paid $${data.amount} towards your balance`;
      document.getElementById("balance-display").innerText = `$${balance -
        data.amount}`;
    })
    .catch(err => {
      console.log("error", err);
      let alertBalance = document.querySelector(".alert");
      alertBalance.innerText = `Please try again. Your payment way unsuccessful. ${err.message}`;
    });
}
