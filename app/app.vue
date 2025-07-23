<template>
  <div class="site-container">
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <div class="site-name">
        <span class="texts">texts</span><span class="dot">.</span><span class="mom">mom</span>
      </div>
      <nav class="site-nav">
        <NuxtLink to="/post" class="nav-link nav-link-post">POST</NuxtLink>
        <NuxtLink to="/about" class="nav-link">ABOUT</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">CONTACT</NuxtLink>
      </nav>
    </header>
    <main v-if="$route.path === '/post'">
      <hr class="site-hr">
      <div class="post-form-container">
        <h1 class="post-title">DROP THE TEXT<span class="green-period">.</span> CLEANSE YOUR SOUL<span class="green-period">.</span></h1>
        <form class="post-form" @submit.prevent="submitPost">
          <div class="form-group">
            <label for="name" class="form-label">NAME</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              class="form-input"
              placeholder="Your name, not your mom's..."
              required
            />
          </div>
          
          <div class="form-group">
            <label for="text" class="form-label">TEXT</label>
            <textarea 
              id="text" 
              v-model="form.text" 
              class="form-textarea" 
              rows="6"
              placeholder="Share the mom text that made you laugh, cry, or question reality..."
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="country" class="form-label">COUNTRY</label>
            <select 
              id="country" 
              v-model="form.country" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a country</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>
          
          <div v-if="form.country === 'United States'" class="form-group">
            <label for="state" class="form-label">STATE</label>
            <select 
              id="state" 
              v-model="form.state" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a state</option>
              <option v-for="state in usStates" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
          </div>
          
          <button type="submit" class="submit-btn">SUBMIT</button>
        </form>
      </div>
    </main>
    <main v-else-if="$route.path === '/contact'">
      <hr class="site-hr">
      <div class="post-form-container">
        <h1 class="post-title">GET IN TOUCH<span class="green-period">.</span> WE'RE LISTENING<span class="green-period">.</span></h1>
        <form class="post-form" @submit.prevent="submitContact">
          <div class="form-group">
            <label for="contact-name" class="form-label">NAME</label>
            <input 
              type="text" 
              id="contact-name" 
              v-model="contactForm.name" 
              class="form-input"
              placeholder="Your actual name this time..."
              required
            />
          </div>
          
          <div class="form-group">
            <label for="contact-email" class="form-label">EMAIL</label>
            <input 
              type="email" 
              id="contact-email" 
              v-model="contactForm.email" 
              class="form-input"
              placeholder="We promise not to spam you with mom jokes..."
              required
            />
          </div>
          
          <div class="form-group">
            <label for="contact-message" class="form-label">MESSAGE</label>
            <textarea 
              id="contact-message" 
              v-model="contactForm.message" 
              class="form-textarea" 
              rows="6"
              placeholder="Tell us what's on your mind. Complaints about your mom are welcome..."
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="contact-country" class="form-label">COUNTRY</label>
            <select 
              id="contact-country" 
              v-model="contactForm.country" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a country</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>
          
          <div v-if="contactForm.country === 'United States'" class="form-group">
            <label for="contact-state" class="form-label">STATE</label>
            <select 
              id="contact-state" 
              v-model="contactForm.state" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a state</option>
              <option v-for="state in usStates" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
          </div>
          
          <button type="submit" class="submit-btn">SEND MESSAGE</button>
        </form>
      </div>
    </main>
    <main v-else-if="$route.path === '/about'">
      <hr class="site-hr">
      <div class="about-container">
        <h1 class="about-title">She typed it<span class="green-period">.</span> You read it<span class="green-period">.</span> We all suffer together<span class="green-period">.</span></h1>
        
        <div class="about-content">
          <p>She means well<span class="green-period">.</span> She really does<span class="green-period">.</span></p>
          <p>But somewhere between the missed punctuation, the all-caps threats, the cryptic emojis, and the "who is this" follow-ups… something unravels<span class="green-period">.</span></p>
          
          <p>texts<span class="green-period">.</span>mom is a shrine to the glorious dysfunction of modern motherhood—one, unhinged message at a time<span class="green-period">.</span></p>
          <p>We don't judge<span class="green-period">.</span> We just document<span class="green-period">.</span></p>
          <p>Whether it's passive-aggressive guilt, baffling autocorrects, or love disguised as psychological warfare, if she texted it—you can post it<span class="green-period">.</span></p>
          
          <p class="about-final">You're not alone<span class="green-period">.</span> Your mom just texts like this<span class="green-period">.</span></p>
        </div>
      </div>
    </main>
    <main v-else>
      <hr class="site-hr">
      <div class="main-blurb">
        <div class="fade-word fade-word-1">UNHINGED<span class="green-period">.</span></div>
        <div class="fade-word fade-word-2">DERANGED<span class="green-period">.</span></div>
        <div class="fade-word fade-word-3">CONFUSING<span class="green-period">.</span></div>
      </div>
      <div class="main-blurb2">
      You know a<span class="blurb2"> mom </span>text when you see one<span class="green-period">.</span>
      </div>
      <hr class="site-hr2">
      <div class="main-postit">
        <div class="postit2">NOTICE: Every 60 seconds, over 2 million texts are sent by... mothers... all over the world. If you get a mom text, stay calm and immediately share it here.</div>        
      </div>
    </main>
    <footer class="site-footer">
      <div class="copyright">
        © 2025 texts.mom - All rights reserved
      </div>
    </footer>
  </div>
</template>

<script setup>
const form = ref({
  name: '',
  text: '',
  country: '',
  state: ''
})

const contactForm = ref({
  name: '',
  email: '',
  message: '',
  country: '',
  state: ''
})

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Japan',
  'South Korea',
  'India',
  'Brazil',
  'Mexico',
  'Argentina',
  'Other'
]

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
]

const submitPost = () => {
  // Handle form submission here
  console.log('Form submitted:', form.value)
  // You can add API call or other logic here
  alert('Thank you for sharing your mom text!')
  
  // Reset form
  form.value = {
    name: '',
    text: '',
    country: '',
    state: ''
  }
}

const submitContact = () => {
  // Handle contact form submission here
  console.log('Contact form submitted:', contactForm.value)
  // You can add API call or other logic here
  alert('Thanks for reaching out! We\'ll get back to you soon.')
  
  // Reset contact form
  contactForm.value = {
    name: '',
    email: '',
    message: '',
    country: '',
    state: ''
  }
}
</script>

<style>
/* Base typography setup */
body {
  background-color: #1B1B2A;
  margin: 0;
  padding: 0;
  font-family: 'Nunito', sans-serif;
  color: white;
}

html {
  background-color: #1B1B2A;
}

/* Primary typography - BebasNeue for titles and headlines */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Bebas Neue', sans-serif;
  color: white;
  margin: 0;
  line-height: 1.2;
}

h1 {
  font-size: 3rem;
  text-align: center;
  padding: 2rem;
  letter-spacing: 0.05em;
}

h2 {
  font-size: 2.5rem;
  letter-spacing: 0.04em;
}

h3 {
  font-size: 2rem;
  letter-spacing: 0.03em;
}

/* Secondary typography - Nunito for everything else */
p, span, div, a, button, input, textarea, label {
  font-family: 'Nunito', sans-serif;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

a {
  color: #60a5fa;
  text-decoration: none;
}

a:hover {
  color: #93c5fd;
  text-decoration: underline;
}

/* Site container for reduced width */
.site-container {
  max-width: 75%;
  margin: 0 auto;
  min-height: 100vh;
}

/* Site header and name styling */
.site-header {
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: #1B1B2A;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-name {
  font-size: 2.5rem;
  font-weight: bold;
  display: inline-block;
}

.site-name .texts {
  font-family: 'Bebas Neue', sans-serif;
  color: white;
  letter-spacing: 0.02em;
}

.site-name .dot {
  font-family: 'Nunito', sans-serif;
  color: #00FFB3
}

.site-name .mom {
  font-family: 'Nunito', sans-serif;
  color: #FF007A;
}

/* Green periods for contact page heading */
.green-period {
  color: #00FFB3;
}

/* Navigation menu styling */
.site-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-family: 'Bebas Neue', sans-serif;
  color: white;
  text-decoration: none;
  font-size: 2.2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #00FFB3;
}

.nav-link-post {
  color: #FF007A;
}

.nav-link-post:hover {
  color: #ff4da6;
}

/* Main content styling */
main {
  padding-top: 1rem;
}

.main-blurb {
  font-family: 'Nunito', sans-serif;
  font-size: 5.5rem;
  margin-left: 1.75rem;
  margin-top: 3rem;
  line-height: 6rem;
}

.main-blurb2 {
  font-family: 'Bebas Neue', sans-serif !important;
  font-size: 5.5rem;
  margin-left: 1.75rem;
  margin-top: 3rem;
  line-height: 1rem;
}

.blurb2 {
  font-family: 'Bebas Neue', sans-serif;
  color: #FF007A;
}

.postit {
   font-family: 'Nunito', sans-serif; 
  color: #FFF;
}

.main-postit {
  font-family: 'Nunito', sans-serif;  
  font-weight: 900;
  color: #FFF;
  font-size: 1.5rem;
  margin-left: 1.75rem;
  margin-top: 3rem;
}

.site-hr {
  border-color: #FF007A;
}

.site-hr2 {
  margin-top: 5rem;
  border-color: #FF007A;
}

/* Fade-in animation for words */
.fade-word {
  opacity: 0;
  animation: fadeIn 1.5s ease-in-out forwards;
  font-family: 'Bebas Neue', sans-serif !important;
}

.fade-word-1 {
  animation-delay: 0s;
}

.fade-word-2 {
  animation-delay: 1.5s;
}

.fade-word-3 {
  animation-delay: 3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Post form styling */
.post-form-container {
  margin: 3rem 1.75rem;
}

.post-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
  letter-spacing: 0.05em;
}

.post-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  color: white;
  display: block;
  margin-bottom: 0.5rem;
  letter-spacing: 0.03em;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 1rem;
  background-color: #2A2A3E;
  border: 2px solid #3A3A4E;
  border-radius: 8px;
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #FF007A;
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background-color: #2A2A3E;
  color: white;
  padding: 0.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-textarea::placeholder {
  color: #888;
  font-style: italic;
}

.submit-btn {
  background-color: #FF007A;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin: 2rem auto 0;
}

.submit-btn:hover {
  background-color: #ff4da6;
}

/* About page styling */
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.about-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 64px;
  text-align: center;
  margin-bottom: 3rem;
  letter-spacing: 0.05em;
  line-height: 1.3;
}

.about-content {
  font-family: 'Nunito', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: white;
}

.about-content p {
  margin-bottom: 1.5rem;
  text-align: left;
}

.about-final {
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #FF007A;
}

/* Footer styling */
.site-footer {
  margin-top: 4rem;
  padding: 2rem 0;
  
  text-align: center;
}

.copyright {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  color: #00FFB3;
  opacity: 0.8;
}

</style>

