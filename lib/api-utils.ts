export async function uploadFile(data: File) {
  const formData = new FormData();
  formData.append("file", data);
  return await fetch("/api/files/upload", {
    method: "POST",
    body: formData,
  });
}
