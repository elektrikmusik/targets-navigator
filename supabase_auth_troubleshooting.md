# Supabase Authentication Troubleshooting for Power Query

## Common Authentication Issues & Solutions

### Issue 1: "Couldn't authenticate with the provided credentials"

**Possible Causes:**

1. Incorrect API key format
2. Missing or wrong headers
3. Supabase RLS (Row Level Security) blocking access
4. Network/firewall issues

## Solution 1: Verify Your Supabase API Key

1. **Go to your Supabase Dashboard**
2. **Navigate to**: Settings → API
3. **Copy the "anon public" key** (not the service role key)
4. **Format should look like**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Solution 2: Test with Simple Query First

Try this minimal query to test authentication:

```m
let
    SupabaseUrl = "https://dnlnfohcjvoqwuufpyyo.supabase.co",
    SupabaseKey = "YOUR_ACTUAL_ANON_KEY_HERE",

    // Simple test query
    Source = Json.Document(Web.Contents(SupabaseUrl & "/rest/v1/companies_profile?select=key,companyName&limit=5", [
        Headers = [
            #"apikey" = SupabaseKey,
            #"Authorization" = "Bearer " & SupabaseKey
        ]
    ]))
in Source
```

## Solution 3: Check Supabase RLS Settings

1. **Go to Supabase Dashboard** → Authentication → Policies
2. **Check if RLS is enabled** on your tables
3. **If enabled, either:**
   - Disable RLS temporarily for testing
   - Create a policy that allows public access
   - Use service role key instead (more secure)

## Solution 4: Alternative Authentication Methods

### Method A: Using Query Parameters

```m
let
    Source = Json.Document(Web.Contents("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/companies_profile", [
        Query = [
            apikey = "YOUR_ANON_KEY"
        ]
    ]))
in Source
```

### Method B: Using OData Feed

```m
let
    Source = OData.Feed("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/companies_profile", null, [
        Headers = [
            #"apikey" = "YOUR_ANON_KEY",
            #"Authorization" = "Bearer YOUR_ANON_KEY"
        ]
    ])
in Source
```

### Method C: Using Service Role Key (More Permissions)

```m
let
    Source = Json.Document(Web.Contents("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/companies_profile?select=*", [
        Headers = [
            #"apikey" = "YOUR_SERVICE_ROLE_KEY",
            #"Authorization" = "Bearer YOUR_SERVICE_ROLE_KEY"
        ]
    ]))
in Source
```

## Solution 5: Step-by-Step Debugging

### Step 1: Test Basic Connection

```m
let
    // Test if Supabase is reachable
    Source = Web.Contents("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/", [
        Headers = [
            #"apikey" = "YOUR_ANON_KEY"
        ]
    ])
in Source
```

### Step 2: Test with Specific Table

```m
let
    Source = Json.Document(Web.Contents("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/companies_profile", [
        Headers = [
            #"apikey" = "YOUR_ANON_KEY",
            #"Authorization" = "Bearer YOUR_ANON_KEY"
        ]
    ]))
in Source
```

### Step 3: Add Error Handling

```m
let
    Source = try Json.Document(Web.Contents("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/companies_profile", [
        Headers = [
            #"apikey" = "YOUR_ANON_KEY",
            #"Authorization" = "Bearer YOUR_ANON_KEY"
        ]
    ])) otherwise [Error = "Authentication failed"]
in Source
```

## Solution 6: Check Network Settings

1. **Corporate Firewall**: May block external API calls
2. **Proxy Settings**: Configure in Power Query if needed
3. **SSL/TLS Issues**: Try HTTP instead of HTTPS (not recommended for production)

## Solution 7: Alternative Data Source

If Supabase continues to have issues, consider:

1. **Export data to CSV** from Supabase and import to Excel
2. **Use Supabase's built-in export** feature
3. **Create a simple API endpoint** that returns JSON
4. **Use a different data source** temporarily

## Quick Fix Checklist

- [ ] Copied the correct "anon public" key (not service role)
- [ ] Key is properly formatted (starts with "eyJ...")
- [ ] Headers include both "apikey" and "Authorization"
- [ ] RLS is disabled or proper policies are set
- [ ] Network allows external API calls
- [ ] Testing with simple query first
- [ ] Using HTTPS (not HTTP)

## Test Query Template

Use this template to test your connection:

```m
let
    // Replace with your actual details
    SupabaseUrl = "https://dnlnfohcjvoqwuufpyyo.supabase.co",
    SupabaseKey = "YOUR_ACTUAL_ANON_KEY",

    // Test query
    Source = Json.Document(Web.Contents(SupabaseUrl & "/rest/v1/companies_profile?select=key,companyName&limit=1", [
        Headers = [
            #"apikey" = SupabaseKey,
            #"Authorization" = "Bearer " & SupabaseKey
        ]
    ]))
in Source
```

If this works, you can then expand to get more data and join with other tables.
