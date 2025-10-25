# sidating-app-fe

# Tutorial 6
## 1. Perhatikan apa yang terjadi pada file index.vue pada branch feat/tutorial-6. Apa yang terjadi setelah git cherry-pick dilakukan? Apakah kita bisa melakukan cherry-pick tanpa harus melakukan commit?
Setelah git cherry-pick dijalankan di branch feat/tutorial-6, file tutorial-6/index langsung berubah, dan git cherry-pick langsung membuat commit baru dengan perubahan yang sama di branch aktif (branch feat/tutorial-6). Ya, cherry-pick bisa dilakukan tanpa harus membuat commit baru secara otomatis. Menggunakan perintah git cherry-pick -n <sha>, file terbaru akan masuk kedalam staging area dulu, dan tidak membuat commit secara langsung. 

referensi: https://git-scm.com/docs/git-cherry-pick

## 2. 

![Screenshot](docs/images/screenshot1.png)
