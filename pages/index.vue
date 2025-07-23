<template>
  <div>
    <main>
      <hr class="site-hr">
      <div class="main-blurb">
        <div class="fade-word fade-word-1">UNHINGED.</div>
        <div class="fade-word fade-word-2">DERANGED.</div>
        <div class="fade-word fade-word-3">CONFUSING.</div>
      </div>
      <div class="main-blurb2">
      You know a<span class="blurb2"> mom </span>text when you see one.
      </div>
      <hr class="site-hr2">
      <div class="main-postit">
        <div class="postit2">NOTICE: Every 60 seconds, over 2 million texts are sent by... mothers... all over the world. If you get a mom text, stay calm and immediately share it here.</div>        
      </div>
    </main>
  </div>
</template>

<style>
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

/* Main content styling */
main {
  padding-top: 1rem;
}
</style>
