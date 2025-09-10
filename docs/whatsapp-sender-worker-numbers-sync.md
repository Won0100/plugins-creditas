# WhatsApp Sender Worker Numbers Sync Configuration

## Overview

The WhatsApp Sender component now supports worker-specific phone numbers through a Sync document. This allows different workers to have their own authorized phone numbers for sending WhatsApp messages.

## Sync Document Setup

### Document Details
- **Service Name**: `flex-plugins` (or your configured sync service)
- **Document Name**: `whatsapp_sender_worker_numbers`
- **Document Type**: Object mapping worker emails to phone number arrays

### Document Structure

The sync document should contain an object where keys are worker email addresses and values are arrays of authorized phone numbers:

```json
{
  "athan.eduarte@creditas.com": ["+55911111111", "+55922222222"],
  "other.worker@creditas.com": ["+55933333333"],
  "supervisor@creditas.com": ["+55944444444", "+55955555555"]
}
```

### How to Create/Update the Document

1. **Via Twilio Console**:
   - Go to Twilio Console > Sync > Services
   - Select your sync service (usually `flex-plugins`)
   - Create a new document with name `whatsapp_sender_worker_numbers`
   - Set the data to an object mapping worker emails to phone number arrays

2. **Via API**:
   ```bash
   curl -X POST https://sync.twilio.com/v1/Services/{SYNC_SERVICE_SID}/Documents \
     -H "Authorization: Basic {BASE64_ENCODED_CREDENTIALS}" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "UniqueName=whatsapp_sender_worker_numbers" \
     -d "Data={\"athan.eduarte@creditas.com\":[\"+55911111111\",\"+55922222222\"]}"
   ```

3. **Via Flex Plugin Code**:
   ```javascript
   import { whatsappSenderWorkerNumbersDocument } from './src/services/sync/whatsappSenderWorkerNumbers';
   
   // Update the document
   await whatsappSenderWorkerNumbersDocument.update({
     "athan.eduarte@creditas.com": ["+55911111111", "+55922222222"],
     "other.worker@creditas.com": ["+55933333333"]
   });
   ```

## Behavior

### When Worker Numbers are Found
- Worker-specific phone numbers are added to the sender list
- Numbers appear as "Worker Number (+55911111111)" in the dropdown
- Both regular senders and worker numbers are available
- Console logs show which numbers were found for the current user

### When No Worker Numbers are Found
- Only regular senders from the Content API are shown
- No error is thrown, the component continues to function normally
- Console logs indicate no worker numbers were found for the user

### Error Handling
- If the sync document cannot be loaded, only regular senders are shown
- Errors are logged to console but don't prevent sender loading
- The component continues to function normally

## Worker Email Identification

The component uses the current worker's identity (email) to find their authorized numbers:

- **Source**: `manager.user.identity` from Flex Manager
- **Format**: Should match the email addresses used as keys in the sync document
- **Case Sensitivity**: Email addresses are matched exactly as stored in the sync document

## Phone Number Format

### Input Format
Phone numbers in the sync document should be in E.164 format:
- ✅ `+55911111111`
- ✅ `+5511999999999`
- ❌ `11999999999` (missing country code)
- ❌ `+55 11 9999-9999` (contains formatting)

### Usage in WhatsApp
When sending messages, the numbers are used as-is for the `from` parameter in the Content API.

## Troubleshooting

### No Worker Numbers Showing
1. Check if the sync document exists and has valid data
2. Verify the worker's email address matches exactly in the sync document
3. Check browser console for error messages
4. Ensure the worker is properly authenticated in Flex

### All Numbers Showing (No Worker Filtering)
1. Check if the sync document exists
2. Verify the document name is exactly `whatsapp_sender_worker_numbers`
3. Check browser console for sync loading errors
4. Ensure the sync service SID is correctly configured

### Console Errors
- Check the browser console for detailed error messages
- Verify your Twilio credentials and permissions
- Ensure the sync service is properly configured

### Worker Email Not Found
1. Verify the worker's email in Flex matches the key in the sync document
2. Check the browser console for the current user identity
3. Ensure the email address is exactly the same (including case)

## Integration with Existing Features

### Template Filtering
Worker numbers work alongside the existing template filtering feature:
- Templates are filtered by `whatsapp_sender_templates` document
- Senders include both regular senders and worker-specific numbers
- Both features can be used simultaneously

### Conversation Creation
When using worker numbers:
- The worker number is used as the `from` address
- Conversation attributes include the worker number information
- Participant binding uses the worker number for WhatsApp routing

## Security Considerations

- Only authorized phone numbers for the current worker are shown
- Worker numbers are isolated per worker email
- No cross-worker access to phone numbers
- All numbers must be pre-approved in your Twilio account 