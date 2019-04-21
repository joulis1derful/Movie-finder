<script>
export default {
    name: 'profile'
}
</script>


<template>
<div class="container">
  <div class="row">
    <div class="col-md-6 img">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvzOpl3-kqfNbPcA_u_qEZcSuvu5Je4Ce_FkTMMjxhB-J1wWin-Q"  alt="" class="img-rounded">
    </div>
    <div class="col-md-6 details">
      <blockquote>
        <h5>Fiona Gallagher</h5>
        <small><cite title="Source Title">Chicago, United States of America  <i class="icon-map-marker"></i></cite></small>
      </blockquote>
      <p>
        fionagallager@shameless.com <br>
        www.bootsnipp.com <br>
        June 18, 1990
      </p>
    </div>
  </div>
</div>
</template>

<style scoped>
.container{
    padding:5%;
}
.container .img{
    text-align:center;
}
.container .details{
    border-left:3px solid #ded4da;
}
.container .details p{
    font-size:15px;
    font-weight:bold;
}
</style>

