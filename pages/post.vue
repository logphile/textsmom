<template>
  <div>
    <main>
      <hr class="site-hr">
      <div class="post-form-container">
        <h1 class="post-title">SHARE YOUR MOM TEXT</h1>
        <form class="post-form" @submit.prevent="submitPost">
          <div class="form-group">
            <label for="name" class="form-label">NAME</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              class="form-input" 
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
            <input 
              type="text" 
              id="country" 
              v-model="form.country" 
              class="form-input" 
              required
            />
          </div>
          
          <button type="submit" class="submit-btn">SUBMIT</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
const form = ref({
  name: '',
  text: '',
  country: ''
})

const submitPost = () => {
  // Handle form submission here
  console.log('Form submitted:', form.value)
  // You can add API call or other logic here
  alert('Thank you for sharing your mom text!')
  
  // Reset form
  form.value = {
    name: '',
    text: '',
    country: ''
  }
}
</script>

<style>
/* Main content styling */
main {
  padding-top: 1rem;
}

.site-hr {
  border-color: #FF007A;
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
.form-textarea {
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
.form-textarea:focus {
  outline: none;
  border-color: #FF007A;
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
</style>
