const RUPEE = String.fromCharCode(8377);

var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = hamburger.querySelector('i');


cartIcon.addEventListener('click', () =>  cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () =>  cartTab.classList.remove('cart-tab-active'));
hamburger.addEventListener('click', (e) => {
  e.preventDefault();
  mobileMenu.classList.toggle('active');
  bars.classList.toggle('fa-bars');
  bars.classList.toggle('fa-xmark');
});

const mobileMenuCloseBtn = mobileMenu.querySelector('.mobile-menu-close');
mobileMenuCloseBtn?.addEventListener('click', (e) => e.preventDefault());

// Close the mobile menu once a link is tapped (so it doesn't stay open
// after navigating to the section). Closed instantly, without the usual
// slide animation, so the panel doesn't linger over the destination
// section while the page is smooth-scrolling to it.
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.style.transition = 'none';
    mobileMenu.classList.remove('active');
    bars.classList.add('fa-bars');
    bars.classList.remove('fa-xmark');
    // force a reflow so the instant close is applied before the
    // transition gets restored on the next line
    void mobileMenu.offsetWidth;
    mobileMenu.style.transition = '';
  });
});

// Highlight the nav link for the section currently in view
const navLinks = document.querySelectorAll('.navlist a, .mobile-menu a:not(.btn)');
const sections = document.querySelectorAll('main section[id]');

const setActiveLink = () => {
  let currentId = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active-link');
    }
  });
};

window.addEventListener('scroll', setActiveLink);
setActiveLink();


let productList = [];
let cartProduct = []; 

const updateTotals = () =>{

  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll('.item').forEach(item=>{

    const quantity = parseInt(item.querySelector('.quantity-value').textContent);
    const price = parseFloat(item.querySelector('.item-total').textContent.replace(/[^0-9.]/g, ''));
    
    totalPrice += price;
    totalQuantity += quantity;
   });

    cartTotal.textContent = `${RUPEE}${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQuantity;
}

const showCards = () => {
  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    orderCard.innerHTML = `
          <div class="card-image">
              <img src="${product.image}" alt="${product.name}">
           </div>
           <h4>${product.name}</h4>
           <h4 class="price">${product.price}</h4>
           <a href="#" class="btn card-btn">Add to Cart</a>
           `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");
    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();

      addToCart(product);
    });
  });
};

const addToCart = (product) => { 


  const existingProduct = cartProduct .find(item => item.id===product.id);
  if(existingProduct){

    alert('Item already in your cart!');
    return; 
  }

  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace(/[^0-9.]/g, ''))
     

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}">
         </div>

         <div class="detail"> 
            <h4>${product.name}</h4>
            <h4 class="item-total">${product.price}</h4>
         </div>

         <div class="flex">
            <a href="#" class="quantity-btn minus">
           <i class="fa-solid fa-minus"></i>
           </a>
           <h4 class="quantity-value">${quantity}</h4>
  
           <a href="#" class="quantity-btn plus">
           <i class="fa-solid fa-plus"></i>
            </a>
          </div>
  `;


  cartList.appendChild(cartItem);
  updateTotals();

  const plusBtn = cartItem.querySelector('.plus');
  const quantityValue = cartItem .querySelector('.quantity-value');
  const itemTotal = cartItem.querySelector('.item-total');
  const minusBtn = cartItem.querySelector('.minus');

  plusBtn.addEventListener('click' , (e)=>{
    e.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `${RUPEE}${(price * quantity).toFixed(2)}`
    updateTotals();
  });

  minusBtn.addEventListener('click', (e)=>{
      e.preventDefault();

      if(quantity > 1){
        
        quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `${RUPEE}${(price * quantity).toFixed(2)}`;
      updateTotals();
      }

      else{
        cartItem.classList.add('slide-out')


        setTimeout(()=>{
        cartItem.remove();
        cartProduct = cartProduct.filter(item => item.id !==product.id);
        updateTotals();
        },300)
      }
      
  });
}

const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productList = data;
      showCards();
    });
};

initApp();




const authOverlay = document.querySelector('.auth-overlay');
const authClose = document.querySelector('.auth-close');
const signinBtns = document.querySelectorAll('.signin-btn');
const modalTabs = document.querySelectorAll('.modal-tab');
const tabIndicator = document.querySelector('.tab-indicator');
const loginForm = document.querySelector('.auth-form[data-form="login"]');
const signupForm = document.querySelector('.auth-form[data-form="signup"]');
const userInfo = document.querySelector('.user-info');
const userEmailEl = document.querySelector('.user-email');
const logoutBtn = document.querySelector('.logout-btn');

const clearAuthErrors = () => {
  document.querySelectorAll('.auth-error').forEach((el) => { el.textContent = ''; });
};

const moveTabIndicator = (tabEl) => {
  if (!tabIndicator || !tabEl) return;
  tabIndicator.style.width = `${tabEl.offsetWidth}px`;
  tabIndicator.style.transform = `translateX(${tabEl.offsetLeft}px)`;
};

const switchAuthTab = (tabName) => {
  modalTabs.forEach((tab) => {
    tab.classList.toggle('active-tab', tab.dataset.tab === tabName);
  });

  loginForm.classList.toggle('hidden', tabName !== 'login');
  signupForm.classList.toggle('hidden', tabName !== 'signup');

  clearAuthErrors();

  const activeTab = [...modalTabs].find((tab) => tab.dataset.tab === tabName);
  moveTabIndicator(activeTab);
};

const openAuthModal = (tabName = 'login') => {
  if (!authOverlay) return;
  authOverlay.classList.add('overlay-active');
  switchAuthTab(tabName);
};

const closeAuthModal = () => {
  if (!authOverlay) return;
  authOverlay.classList.remove('overlay-active');
  clearAuthErrors();
  loginForm.reset();
  signupForm.reset();
};

signinBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('login');
  });
});

authClose?.addEventListener('click', (e) => {
  e.preventDefault();
  closeAuthModal();
});

authOverlay?.addEventListener('click', (e) => {
  if (e.target === authOverlay) closeAuthModal();
});

modalTabs.forEach((tab) => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthTab(tab.dataset.tab);
  });
});

// Keep the sliding indicator aligned if the window resizes while the modal is open
window.addEventListener('resize', () => {
  const activeTab = [...modalTabs].find((tab) => tab.classList.contains('active-tab'));
  if (authOverlay?.classList.contains('overlay-active')) moveTabIndicator(activeTab);
});

const showAuthError = (form, message) => {
  const errorEl = form.querySelector('.auth-error');
  if (errorEl) errorEl.textContent = message;
};

const friendlyAuthError = (error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAuthErrors();

    if (!window.firebaseIsConfigured) {
      showAuthError(loginForm, "Firebase isn't configured yet — add your project keys in firebase-config.js.");
      return;
    }

    const email = loginForm.querySelector('.login-email').value.trim();
    const password = loginForm.querySelector('.login-password').value;
    const submitBtn = loginForm.querySelector('.auth-submit');

    submitBtn.disabled = true;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        closeAuthModal();
      })
      .catch((error) => {
        showAuthError(loginForm, friendlyAuthError(error));
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAuthErrors();

    if (!window.firebaseIsConfigured) {
      showAuthError(signupForm, "Firebase isn't configured yet — add your project keys in firebase-config.js.");
      return;
    }

    const email = signupForm.querySelector('.signup-email').value.trim();
    const password = signupForm.querySelector('.signup-password').value;
    const submitBtn = signupForm.querySelector('.auth-submit');

    submitBtn.disabled = true;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        closeAuthModal();
      })
      .catch((error) => {
        showAuthError(signupForm, friendlyAuthError(error));
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}

logoutBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  firebase.auth().signOut();
});


const ORDER_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const yourOrderLinks = document.querySelectorAll('#your-order-link, #your-order-link-mobile');

const saveLastOrder = (paymentId, amountRupees) => {
  const order = { paymentId, amount: amountRupees, timestamp: Date.now() };
  try {
    localStorage.setItem('lastOrder', JSON.stringify(order));
  } catch (err) {
    console.warn('Could not save order locally:', err);
  }
  refreshYourOrderLink();
};

const getValidLastOrder = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem('lastOrder'));
  } catch (err) {
    stored = null;
  }
  if (!stored) return null;

  const expired = Date.now() - stored.timestamp > ORDER_TTL_MS;
  if (expired) {
    localStorage.removeItem('lastOrder');
    return null;
  }
  return stored;
};

const refreshYourOrderLink = () => {
  const order = getValidLastOrder();
  yourOrderLinks.forEach((link) => {
    link.classList.toggle('hidden', !order);
  });
};

yourOrderLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const order = getValidLastOrder();
    if (!order) {
      alert('No active order — order details expire 2 hours after checkout.');
      refreshYourOrderLink();
      return;
    }
    showOrderSuccess(order.paymentId, order.amount, false);
  });
});

// Check on load, and periodically after, in case the 2-hour window
// lapses while the tab stays open.
refreshYourOrderLink();
setInterval(refreshYourOrderLink, 60 * 1000);

const successOverlay = document.querySelector('.success-overlay');
const successCloseEls = document.querySelectorAll('.success-close');
const orderIdEl = document.querySelector('.order-id');
const orderAmountEl = document.querySelector('.order-amount');

const showOrderSuccess = (paymentId, amountRupees, isNewOrder = true) => {
  if (orderIdEl) orderIdEl.textContent = paymentId;
  if (orderAmountEl) orderAmountEl.textContent = `${RUPEE}${amountRupees.toFixed(2)}`;
  successOverlay?.classList.add('overlay-active');
  cartTab.classList.remove('cart-tab-active'); // close the cart panel behind it
  if (isNewOrder) saveLastOrder(paymentId, amountRupees);
};

successCloseEls.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    successOverlay?.classList.remove('overlay-active');
  });
});

successOverlay?.addEventListener('click', (e) => {
  if (e.target === successOverlay) successOverlay.classList.remove('overlay-active');
});

const clearCart = () => {
  cartProduct = [];
  cartList.innerHTML = '';
  updateTotals();
};

const checkoutBtn = document.querySelector('#checkout-btn');
const orderNowBtn = document.querySelector('#order-now-btn');

const openRazorpayCheckout = () => {
  if (cartProduct.length === 0) {
    alert('Your cart is empty. Add something from the menu first!');
    cartTab.classList.add('cart-tab-active');
    return;
  }

  const totalRupees = parseFloat(cartTotal.textContent.replace(/[^0-9.]/g, ''));
  const currentUser = window.firebaseIsConfigured && firebase.auth().currentUser;

  const options = {
    key: "rzp_live_TNEVzZaud363yp",
    amount: Math.round(totalRupees * 100), // Razorpay wants paise
    currency: "INR",
    name: "Foodie",
    description: "Food order payment",
    prefill: {
      email: currentUser ? currentUser.email : "",
    },
    handler: function (response) {
      showOrderSuccess(response.razorpay_payment_id, totalRupees);
      clearCart();
    },
    modal: {
      ondismiss: function () {
        console.log('Checkout closed by user');
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

checkoutBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openRazorpayCheckout();
});

// Hero "Order Now" button — jumps straight to Razorpay using whatever's
// already in the cart (opens the cart panel instead if it's empty).
orderNowBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openRazorpayCheckout();
});


if (window.firebaseIsConfigured && typeof firebase !== 'undefined' && firebase.auth) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      signinBtns.forEach((btn) => btn.classList.add('hidden'));
      userInfo?.classList.add('user-info-active');
      if (userEmailEl) userEmailEl.textContent = user.email;
    } else {
      signinBtns.forEach((btn) => btn.classList.remove('hidden'));
      userInfo?.classList.remove('user-info-active');
      if (userEmailEl) userEmailEl.textContent = '';
    }
  });
} else {
  console.warn('Firebase is not configured — update firebaseConfig in firebase-config.js to enable sign in.');
}





