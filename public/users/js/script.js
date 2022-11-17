
// function addtoWishlist(productId) {

//     console.log("function is working");

//     $.ajax({
//         url: "/addToWishlist/" + productId,
//         method: 'get',
//         success: (response) => {
//             alert(response)
//         }
//     })
// }

let price = document.getElementById("price").value
let quantity = document.getElementById("quantity").value

let total = price * quantity;
document.getElementById('total').innerHTML().value = total