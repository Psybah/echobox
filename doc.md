
# Anonymous Platform API Documentation

## Base URL

```
https://aesthetic-rosalie-kayode01-339252d2.koyeb.app/
```

## Endpoints

### 1. Get All Messages

**Endpoint:**

```
GET /get-messages
```

**Description:**
Retrieves all messages stored in the system.

**Response:**

* `200 OK` - Returns a list of messages.
* `400 Bad Request` - If an error occurs.

---

### 2. Mark Message as Read

**Endpoint:**

```
GET /read-message/{id}
```

**Description:**
Marks a specific message as read.

**Path Parameters:**

| Parameter | Type | Description       |
| --------- | ---- | ----------------- |
| id        | int  | ID of the message |

**Response:**

* `200 OK` - Message marked as read.
* `404 Not Found` - If message ID is invalid.

---

### 3. Add Text Message

**Endpoint:**

```
POST /add-message
```

**Description:**
Adds a new text-only message.

**Form Data:**

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| type      | text | Must be `text` |
| text      | text | Message content  |

**Response:**

* `201 Created` - Message successfully stored.
* `400 Bad Request` - Missing required parameters.

---

### 4. Add Image Message

**Endpoint:**

```
POST /add-message
```

**Description:**
Uploads an image message.

**Form Data:**

| Parameter | Type | Description        |
| --------- | ---- | ------------------ |
| type      | text | Must be `image`  |
| image     | file | Image file         |
| text      | text | Caption (optional) |

**Response:**

* `201 Created` - Image uploaded successfully.
* `400 Bad Request` - Missing required parameters.

---

### 5. Add Document Message

**Endpoint:**

```
POST /add-message
```

**Description:**
Uploads a document message.

**Form Data:**

| Parameter | Type | Description          |
| --------- | ---- | -------------------- |
| type      | text | Must be `document` |
| document  | file | Document file        |
| text      | text | Caption (optional)   |

**Response:**

* `201 Created` - Document uploaded successfully.
* `400 Bad Request` - Missing required parameters.

---

### 6. Add Audio Message

**Endpoint:**

```
POST /add-message
```

**Description:**
Uploads an audio message.

**Form Data:**

| Parameter | Type | Description       |
| --------- | ---- | ----------------- |
| type      | text | Must be `audio` |
| audio     | file | Audio file        |

**Response:**

* `201 Created` - Audio uploaded successfully.
* `400 Bad Request` - Missing required parameters.

---

### 7. Get Media File

**Endpoint:**

```
GET /get-media/{id}
```

**Description:**
Retrieves a media file (image, document, or audio) by message ID.

**Path Parameters:**

| Parameter | Type | Description       |
| --------- | ---- | ----------------- |
| id        | int  | ID of the message |

**Response:**

* `200 OK` - Returns the requested media file.
* `404 Not Found` - If message ID is invalid.

---

## 🚨 Notes for Frontend Developers

### File Type Validation

Ensure the frontend validates file types before sending the request:

* **Images:** Only JPG, PNG, or GIF files are allowed.
* **Documents:** Only PDF files are allowed.
* **Audio:** Only MP3, WAV, or OGG files are allowed.

### 📌 Future Enhancements

* Add user authentication.
* Implement pagination for message retrieval.
* Improve backend validation for file types.

---

This API is subject to modifications and improvements. 🚀
