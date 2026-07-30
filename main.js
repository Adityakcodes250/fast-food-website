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
  bars.classList.toggle('fa-xmark');
});

// Close the mobile menu once a link is tapped (so it doesn't stay open
// after navigating to the section)
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    bars.classList.remove('fa-xmark');
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
    const price = parseFloat(item.querySelector('.item-total').textContent.replace('₹',''));
    
    totalPrice += price;
    totalQuantity += quantity;
   });

    cartTotal.textContent = `₹${totalPrice.toFixed(2)}`;
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
  let price = parseFloat(product.price.replace('₹',''))
     

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
    itemTotal.textContent = `₹${(price * quantity).toFixed(2)}`
    updateTotals();
  });

  minusBtn.addEventListener('click', (e)=>{
      e.preventDefault();

      if(quantity > 1){
        
        quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `₹${(price * quantity).toFixed(2)}`;
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


/* ======================================================
   AUTH (Firebase email/password)
   ====================================================== */

const authOverlay = document.querySelector('.auth-overlay');
const authClose = document.querySelectorAll('.auth-close');
const signinBtns = document.querySelectorAll('.signin-btn');
const modalTabs = document.querySelectorAll('.modal-tab');
const loginForm = document.querySelector('[data-form="login"]');
const signupForm = document.querySelector('[data-form="signup"]');
const userInfo = document.querySelector('.user-info');
const userEmailLabel = document.querySelector('.user-email');
const logoutBtn = document.querySelector('.logout-btn');

const openAuthModal = () => {
  authOverlay.classList.add('overlay-active');
  // indicator needs layout to exist first, so position it right after the modal becomes visible
  requestAnimationFrame(() => {
    const activeTab = document.querySelector('.modal-tab.active-tab');
    if (activeTab) moveTabIndicator(activeTab);
  });
};
const closeAuthModal = () => authOverlay.classList.remove('overlay-active');

const tabIndicator = document.querySelector('.tab-indicator');
const moveTabIndicator = (tab) => {
  if (!tabIndicator) return;
  tabIndicator.style.width = `${tab.offsetWidth}px`;
  tabIndicator.style.transform = `translateX(${tab.offsetLeft}px)`;
};

signinBtns.forEach((btn) => btn.addEventListener('click', (e) => {
  e.preventDefault();
  openAuthModal();
}));

authClose.forEach((btn) => btn.addEventListener('click', (e) => {
  e.preventDefault();
  closeAuthModal();
}));

modalTabs.forEach((tab) => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    modalTabs.forEach((t) => t.classList.remove('active-tab'));
    tab.classList.add('active-tab');
    moveTabIndicator(tab);

    if (tab.dataset.tab === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
    } else {
      signupForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    }
  });
});

// Firebase throws error codes like "auth/wrong-password" — translate the
// common ones into plain, user-facing messages instead of showing that raw.
const getFriendlyAuthError = (err) => {
  const code = err && err.code ? err.code : '';

  const messages = {
    'auth/invalid-email': "That email address doesn't look right. Please check it and try again.",
    'auth/user-disabled': 'This account has been disabled. Contact support if that seems wrong.',
    'auth/user-not-found': "We couldn't find an account with that email. Try signing up instead.",
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/email-already-in-use': 'An account already exists with that email. Try logging in instead.',
    'auth/weak-password': 'Please choose a stronger password — at least 6 characters.',
    'auth/missing-password': 'Please enter a password.',
    'auth/too-many-requests': "Too many attempts. Please wait a moment before trying again.",
    'auth/network-request-failed': 'Network error — please check your connection and try again.',
    'auth/operation-not-allowed': "Email/password sign-in isn't enabled yet. Please contact the site owner.",
    'auth/invalid-api-key': 'The site is not fully set up yet — please contact the site owner.',
    'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'The site is not fully set up yet — please contact the site owner.',
    'auth/app-not-authorized': 'The site is not fully set up yet — please contact the site owner.',
    'auth/configuration-not-found': 'The site is not fully set up yet — please contact the site owner.',
    'auth/internal-error': 'The site is not fully set up yet — please contact the site owner.',
  };

  return messages[code] || 'Something went wrong. Please try again.';
};

// Log in
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const errorEl = loginForm.querySelector('.auth-error');
  errorEl.textContent = '';

  if (window.firebaseIsConfigured === false) {
    errorEl.textContent = 'Sign in is not set up yet — please contact the site owner.';
    return;
  }

  const email = loginForm.querySelector('.login-email').value;
  const password = loginForm.querySelector('.login-password').value;
  const submitBtn = loginForm.querySelector('button, [type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      loginForm.reset();
      closeAuthModal();
    })
    .catch((err) => {
      errorEl.textContent = getFriendlyAuthError(err);
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
});

// Sign up
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const errorEl = signupForm.querySelector('.auth-error');
  errorEl.textContent = '';

  if (window.firebaseIsConfigured === false) {
    errorEl.textContent = 'Sign up is not set up yet — please contact the site owner.';
    return;
  }

  const email = signupForm.querySelector('.signup-email').value;
  const password = signupForm.querySelector('.signup-password').value;
  const submitBtn = signupForm.querySelector('button, [type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      signupForm.reset();
      closeAuthModal();
    })
    .catch((err) => {
      errorEl.textContent = getFriendlyAuthError(err);
    })
    .finally(() => {
      if (submitBtn) submitBtn.disabled = false;
    });
});

// Log out
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  firebase.auth().signOut();
});

// Reflect logged-in/out state in the navbar
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    signinBtns.forEach((btn) => btn.classList.add('hidden'));
    userInfo.classList.add('user-info-active');
    userEmailLabel.textContent = user.email;
  } else {
    signinBtns.forEach((btn) => btn.classList.remove('hidden'));
    userInfo.classList.remove('user-info-active');
    userEmailLabel.textContent = '';
  }
});


/* ======================================================
   CHECKOUT (Razorpay)
   ====================================================== */

const checkoutBtn = document.getElementById('checkout-btn');
const successOverlay = document.querySelector('.success-overlay');
const successClose = document.querySelectorAll('.success-close');
const orderIdLabel = document.querySelector('.order-id');
const orderAmountLabel = document.querySelector('.order-amount');

successClose.forEach((btn) => btn.addEventListener('click', (e) => {
  e.preventDefault();
  successOverlay.classList.remove('overlay-active');
}));

checkoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Must be logged in to pay
  const user = firebase.auth().currentUser;
  if (!user) {
    openAuthModal();
    return;
  }

  const totalText = cartTotal.textContent.replace('₹', '').trim();
  const amount = parseFloat(totalText);

  if (!amount || amount <= 0) {
    alert('Your cart is empty.');
    return;
  }

  try {
    // Ask our Netlify function to create a Razorpay order (keeps the
    // secret key on the server, never in the browser)
    const orderRes = await fetch('/.netlify/functions/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      throw new Error(orderData.error || 'Could not start checkout');
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: 'INR',
      name: 'Foodie',
      description: 'Food order',
      order_id: orderData.orderId,
      prefill: { email: user.email },
      theme: { color: '#f2bd12' },
      handler: async (response) => {
        // Verify the payment signature server-side before treating it as success
        const verifyRes = await fetch('/.netlify/functions/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyRes.json();

        if (verifyData.verified) {
          orderIdLabel.textContent = response.razorpay_payment_id;
          orderAmountLabel.textContent = `₹${amount.toFixed(2)}`;
          successOverlay.classList.add('overlay-active');
          cartTab.classList.remove('cart-tab-active');

          // Clear the cart
          cartList.innerHTML = '';
          cartProduct = [];
          updateTotals();
        } else {
          alert('Payment could not be verified. Please contact support.');
        }
      },
      modal: {
        ondismiss: () => {
          // user closed the Razorpay widget without paying — no action needed
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (err) {
    alert(err.message);
  }
});
