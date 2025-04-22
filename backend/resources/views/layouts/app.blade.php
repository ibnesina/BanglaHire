<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>@yield('title','BanglaHire')</title>

  <!-- Google Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet"/>

  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"/>

  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f1f5f9;
      color: #333;
    }
    .navbar {
      background: linear-gradient(90deg, #4f46e5, #3b82f6);
    }
    .navbar .navbar-brand {
      color: #fff;
      font-weight: 600;
      letter-spacing: .5px;
    }
    .navbar .navbar-brand:hover {
      color: #e0e7ff;
    }
    .container {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
    .card-wrapper {
      background: #fff;
      border-radius: .5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      padding: 2rem;
    }

    /* Footer styles */
    .footer {
      background-color: #cdd1d4;
      color: #495057;
      padding: 3rem 0;
    }
    .footer h5 {
      font-weight: 600;
      color: #212529;
      margin-bottom: 1rem;
    }
    .footer ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer ul li {
      margin-bottom: .5rem;
    }
    .footer a {
      color: #495057;
      text-decoration: none;
    }
    .footer a:hover {
      color: #212529;
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <a class="navbar-brand" href="{{ config('app.frontend_url') }}">BanglaHire</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon" style="filter: invert(1);"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link text-light" href="{{ config('app.frontend_url') }}">Home</a></li>
          <li class="nav-item"><a class="nav-link text-light" href="#">Transactions</a></li>
          <li class="nav-item"><a class="nav-link text-light" href="#">Balance</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Main Content Area -->
  <div class="container">
    <div class="card-wrapper">
      @yield('content')
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="row">
        <!-- For Clients -->
        <div class="col-6 col-md-3 mb-4">
          <h5>For Clients</h5>
          <ul>
            <li><a href="#">How to hire</a></li>
            <li><a href="#">Talent Marketplace</a></li>
            <li><a href="#">project Catalog</a></li>
            <li><a href="#">Hire an agency</a></li>
            <li><a href="#">Contact to hire</a></li>
            <li><a href="#">Direct Contracts</a></li>
            <li><a href="#">Hire worldwide</a></li>
            <li><a href="#">Hide in bangladesh</a></li>
          </ul>
        </div>

        <!-- For Talent -->
        <div class="col-6 col-md-3 mb-4">
          <h5>For Talent</h5>
          <ul>
            <li><a href="#">How to find work</a></li>
            <li><a href="#">Direct Contracts</a></li>
            <li><a href="#">Find jobs wordwide</a></li>
            <li><a href="#">Find jobs in Bangladesh</a></li>
            <li><a href="#">Exclusive resources</a></li>
          </ul>
        </div>

        <!-- Resources -->
        <div class="col-6 col-md-3 mb-4">
          <h5>Resources</h5>
          <ul>
            <li><a href="#">Help and Supports</a></li>
            <li><a href="#">Success stories</a></li>
            <li><a href="#">Reviews</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div class="col-6 col-md-3 mb-4">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Leadership</a></li>
            <li><a href="#">Investors</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">partners</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>

  <!-- Bootstrap JS -->
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
    crossorigin="anonymous"
  ></script>

</body>
</html>
