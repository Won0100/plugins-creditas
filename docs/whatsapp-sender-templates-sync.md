# WhatsApp Sender Templates Sync Configuration

## Overview

The WhatsApp Sender component now uses a Sync document to filter which templates are available for sending messages. This provides better control over which templates agents can use.

## Sync Document Setup

### Document Details
- **Service Name**: `flex-plugins` (or your configured sync service)
- **Document Name**: `whatsapp_sender_templates`
- **Document Type**: Array of template SIDs

### Document Structure

The sync document should contain an object with a "templates" array of template SIDs that are allowed to be used:

```json
{
  "templates": [
    "HX35d69ebf94f714d2e9499956305a94b8",
    "HX7ab0812a2de64e0fadc51c35fc63482c"
  ]
}
```

### How to Create/Update the Document

1. **Via Twilio Console**:
   - Go to Twilio Console > Sync > Services
   - Select your sync service (usually `flex-plugins`)
   - Create a new document with name `whatsapp_sender_templates`
   - Set the data to an array of template SIDs

2. **Via API**:
   ```bash
   curl -X POST https://sync.twilio.com/v1/Services/{SYNC_SERVICE_SID}/Documents \
     -H "Authorization: Basic {BASE64_ENCODED_CREDENTIALS}" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "UniqueName=whatsapp_sender_templates" \
     -d "Data={\"templates\":[\"HX35d69ebf94f714d2e9499956305a94b8\",\"HX7ab0812a2de64e0fadc51c35fc63482c\"]}"
   ```

3. **Via Flex Plugin Code**:
   ```javascript
   import { whatsappSenderTemplatesDocument } from './src/services/sync/whatsappSenderTemplates';
   
   // Update the document
   await whatsappSenderTemplatesDocument.update({
     templates: [
       "HX35d69ebf94f714d2e9499956305a94b8",
       "HX7ab0812a2de64e0fadc51c35fc63482c"
     ]
   });
   ```

## Behavior

### When Sync Document Exists
- Only templates listed in the sync document will be shown in the WhatsApp Sender component
- Templates are filtered by their SID
- Console logs will show the filtering process

### When Sync Document is Missing or Empty
- All available templates will be shown
- No filtering is applied
- This provides backward compatibility

### Error Handling
- If the sync document cannot be loaded, all templates will be shown
- Errors are logged to console but don't prevent template loading
- The component continues to function normally

## Finding Template SIDs

To find the SID of a template you want to allow:

1. **Via Twilio Console**:
   - Go to Content > Templates
   - Click on the template
   - Copy the SID from the URL or template details

2. **Via API**:
   ```bash
   curl -X GET https://content.twilio.com/v1/Content \
     -H "Authorization: Basic {BASE64_ENCODED_CREDENTIALS}"
   ```

3. **Via Flex Plugin**:
   - Check the browser console when loading templates
   - The component logs all available templates and their SIDs

## Troubleshooting

### No Templates Showing
1. Check if the sync document exists and has valid template SIDs
2. Verify the template SIDs are correct
3. Check browser console for error messages
4. Ensure templates are approved and available in your Twilio account

### All Templates Showing (No Filtering)
1. Check if the sync document exists
2. Verify the document name is exactly `whatsapp_sender_templates`
3. Check browser console for sync loading errors
4. Ensure the sync service SID is correctly configured

### Console Errors
- Check the browser console for detailed error messages
- Verify your Twilio credentials and permissions
- Ensure the sync service is properly configured 