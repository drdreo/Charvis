package main

import (
  "bytes"
  "fmt"
  "io"
  "log"
  "net/http"
  "os"

  "github.com/joho/godotenv"
  "github.com/gin-gonic/gin"
  "github.com/gin-contrib/cors"
)

func shouldUseLocalFile() bool {
  return true || os.Getenv("USE_LOCAL_FILE") == "true"
}

func serveLocalFile(c *gin.Context) {
  file, err := os.Open("test.mp3")
  if err != nil {
    log.Println(err)
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open local file"})
    return
  }
  defer file.Close()

  c.Header("Content-Type", "audio/mpeg")
  _, err = io.Copy(c.Writer, file)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream the local file"})
  }
}

func serveFromOpenAPI(c *gin.Context) {
  client := &http.Client{}

  body := []byte(`{
"model": "tts-1",
"input": "Today is a wonderful day to build something innovative. But yet, uh, you suck!",
"voice": "alloy"
}`)
  req, err := http.NewRequest("POST", "https://api.openai.com/v1/audio/speech", bytes.NewReader(body))
  if err != nil {
    log.Println(err)
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create HTTP request"})
    return
  }

  req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("OPENAI_API_KEY")))
  req.Header.Set("Content-Type", "application/json")

  log.Println("Issuing OpenAPI request")

  resp, err := client.Do(req)
  if err != nil {
    log.Println(err)
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send HTTP request"})
    return
  }
  defer resp.Body.Close()

  if resp.StatusCode != http.StatusOK {
    log.Println(resp.Status)
    c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("OpenAI request failed with %s", resp.Status)})
    return
  }

  // save to local file for testing
  file, err := os.Create("test.mp3")
  if err != nil {
    log.Println(err)
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file"})
    return
  }
  defer file.Close()

  // save the response to the file
  _, err = io.Copy(file, resp.Body)
  if err != nil {
    log.Println(err)
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write response to file"})
    return
  }

  // Reset the offset of the file to the beginning
  _, err = file.Seek(0, 0)
  if err != nil {
    log.Println(err)
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seek the file"})
    return
  }

  c.Header("Content-Type", "audio/mpeg")

  _, err = io.Copy(c.Writer, resp.Body)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream the file"})
    return
  }
}

func handleMp3(c *gin.Context) {
  if shouldUseLocalFile() {
    serveLocalFile(c)
  } else {
    serveFromOpenAPI(c)
  }
}

func main() {
  err := godotenv.Load()
  if err != nil {
    log.Fatal("Error loading .env file")
  }

  r := gin.Default()

  config := cors.DefaultConfig()
  config.AllowOrigins = []string{"http://localhost:4200"} // Replace with your frontend's URL
  config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
  config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}

  r.Use(cors.New(config))

  r.GET("/mp3", handleMp3)

  r.Run("127.0.0.1:3001")
}
