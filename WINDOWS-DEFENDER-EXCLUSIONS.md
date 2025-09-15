# Windows Defender Exclusions for Targets Navigator

## Overview

This document provides instructions for configuring Windows Defender to exclude the Targets Navigator application from false positive detection.

## Application Information

- **Name**: Ceres Power Companies Scoring Navigator
- **Version**: 1.0.0
- **Purpose**: Internal company evaluation dashboard
- **Security Level**: Internal use only

## Why Exclusions Are Needed

The application contains legitimate development and deployment scripts that may trigger heuristic detection due to:

- Security scanning patterns in shell scripts
- Docker management commands
- System monitoring functionality
- Development tooling

## Recommended Exclusions

### 1. Directory Exclusions

Add the following directories to Windows Defender exclusions:

```
C:\path\to\targets-navigator\
C:\path\to\targets-navigator\scripts\
C:\path\to\targets-navigator\dist\
C:\path\to\targets-navigator\.claude\
```

### 2. File Type Exclusions

Add the following file extensions to exclusions:

```
*.sh
*.json
*.md
*.yml
*.yaml
```

### 3. Specific File Exclusions

Add these specific files to exclusions:

```
security-audit.sh
health-check.sh
system-monitor.sh
deployment-helper.sh
security-manifest.json
SECURITY-WHITELIST.md
```

### 4. Process Exclusions

Add these processes to exclusions:

```
node.exe
npm.exe
docker.exe
docker-compose.exe
nginx.exe
```

## How to Add Exclusions

### Method 1: Windows Security App

1. Open Windows Security
2. Go to Virus & threat protection
3. Click on "Manage settings" under Virus & threat protection settings
4. Scroll down to "Exclusions"
5. Click "Add or remove exclusions"
6. Click "Add an exclusion"
7. Select "Folder" or "File" as appropriate
8. Browse to the target directory or file
9. Click "Select Folder" or "Select File"

### Method 2: PowerShell (Run as Administrator)

```powershell
# Add directory exclusion
Add-MpPreference -ExclusionPath "C:\path\to\targets-navigator"

# Add file extension exclusion
Add-MpPreference -ExclusionExtension ".sh"

# Add process exclusion
Add-MpPreference -ExclusionProcess "node.exe"
```

### Method 3: Group Policy (Enterprise)

1. Open Group Policy Management Console
2. Navigate to Computer Configuration > Administrative Templates > Windows Components > Microsoft Defender Antivirus > Exclusions
3. Configure the appropriate exclusion policies

## Verification Steps

### 1. Test the Application

1. Navigate to the application directory
2. Run the development server: `npm run dev`
3. Run the security audit: `npm run security-audit`
4. Check that no alerts are triggered

### 2. Check Exclusion Status

```powershell
# View current exclusions
Get-MpPreference | Select-Object -ExpandProperty ExclusionPath
Get-MpPreference | Select-Object -ExpandProperty ExclusionExtension
Get-MpPreference | Select-Object -ExpandProperty ExclusionProcess
```

### 3. Monitor Windows Defender Logs

1. Open Event Viewer
2. Navigate to Windows Logs > Security
3. Look for Microsoft Defender events
4. Verify no false positives are occurring

## Security Considerations

### Before Adding Exclusions

1. Verify the application is from a trusted source
2. Review the security documentation
3. Ensure the application is properly signed (if possible)
4. Confirm the application is used for legitimate business purposes

### After Adding Exclusions

1. Monitor the application for any suspicious behavior
2. Regularly review exclusion lists
3. Keep the application updated
4. Report any security concerns to the IT team

## Troubleshooting

### If Exclusions Don't Work

1. Restart Windows Defender service
2. Update Windows Defender definitions
3. Check for conflicting security software
4. Verify exclusion syntax is correct

### If False Positives Persist

1. Submit the application for Microsoft Defender review
2. Contact Microsoft support with the security manifest
3. Consider code signing the application
4. Review and update security documentation

## Contact Information

- **Security Team**: security@cerespower.com
- **IT Support**: it-support@cerespower.com
- **Development Team**: dev@cerespower.com

## Documentation References

- [Microsoft Defender Exclusion Documentation](https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/configure-exclusions-microsoft-defender-antivirus)
- [Windows Security App Guide](https://support.microsoft.com/en-us/windows/keep-your-computer-secure-at-home-1ed6db5b-81a8-5cee-bf02-1c1a53f8fe9d)
- [PowerShell Defender Commands](https://docs.microsoft.com/en-us/powershell/module/defender/)

## Last Updated

2024-01-10

## Next Review

2024-04-10
