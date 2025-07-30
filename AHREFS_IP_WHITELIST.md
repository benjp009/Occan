# Ahrefs Site Audit IP Whitelist

## Issue
Robots.txt is not accessible to Ahrefs Site Audit crawler. This requires whitelisting Ahrefs IP ranges and user-agent.

## User-Agent to Whitelist
```
AhrefsSiteAudit
```

## IP Ranges to Whitelist

### CIDR Ranges
```
5.39.1.224/27
5.39.109.160/27
15.235.27.0/24
15.235.96.0/24
15.235.98.0/24
37.59.204.128/27
51.68.247.192/27
51.75.236.128/27
51.89.129.0/24
51.161.37.0/24
51.161.65.0/24
51.195.183.0/24
51.195.215.0/24
51.195.244.0/24
51.222.95.0/24
51.222.168.0/24
51.222.253.0/26
54.36.148.0/24
54.36.149.0/24
54.37.118.64/27
54.38.147.0/24
54.39.0.0/24
54.39.6.0/24
54.39.89.0/24
54.39.136.0/24
54.39.203.0/24
54.39.210.0/24
92.222.104.192/27
92.222.108.96/27
94.23.188.192/27
142.44.220.0/24
142.44.225.0/24
142.44.228.0/24
142.44.233.0/24
148.113.128.0/24
148.113.130.0/24
168.100.149.0/24
167.114.139.0/24
176.31.139.0/27
198.244.168.0/24
198.244.183.0/24
198.244.226.0/24
198.244.240.0/24
198.244.242.0/24
202.8.40.0/22
```

### Individual IP Addresses
```
198.244.186.193
198.244.186.194
198.244.186.195
198.244.186.196
198.244.186.197
198.244.186.198
198.244.186.199
198.244.186.200
198.244.186.201
198.244.186.202
202.94.84.110
202.94.84.111
202.94.84.112
202.94.84.113
```

## Server Configuration Examples

### Nginx Configuration
Add to your nginx.conf or site configuration:
```nginx
# Allow Ahrefs crawler
location /robots.txt {
    allow 5.39.1.224/27;
    allow 5.39.109.160/27;
    allow 15.235.27.0/24;
    # ... add all ranges above
    allow 198.244.186.193;
    allow 198.244.186.194;
    # ... add all individual IPs above
    deny all;
}
```

### Apache .htaccess
```apache
<RequireAll>
    Require ip 5.39.1.224/27
    Require ip 5.39.109.160/27
    Require ip 15.235.27.0/24
    # ... add all ranges and IPs above
</RequireAll>
```

### Cloudflare Rules
If using Cloudflare, add these IP ranges to your firewall rules with "Allow" action for requests to `/robots.txt`.

## Application-Level Fix
The server.js has been updated to properly serve robots.txt and sitemap.xml files directly before the catch-all React route.

## Testing
After implementing the whitelist, test robots.txt accessibility:
```bash
curl -H "User-Agent: AhrefsSiteAudit" https://logicielfrance.com/robots.txt
```

Should return:
```
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
Sitemap: https://logicielfrance.com/sitemap.xml
```