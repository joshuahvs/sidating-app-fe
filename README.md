# sidating-app-fe

# Tutorial 6
## 1. Perhatikan apa yang terjadi pada file index.vue pada branch feat/tutorial-6. Apa yang terjadi setelah git cherry-pick dilakukan? Apakah kita bisa melakukan cherry-pick tanpa harus melakukan commit?
Setelah git cherry-pick dijalankan di branch feat/tutorial-6, file tutorial-6/index langsung berubah, dan git cherry-pick langsung membuat commit baru dengan perubahan yang sama di branch aktif (branch feat/tutorial-6). Ya, cherry-pick bisa dilakukan tanpa harus membuat commit baru secara otomatis. Menggunakan perintah git cherry-pick -n <sha>, file terbaru akan masuk kedalam staging area dulu, dan tidak membuat commit secara langsung. 

referensi: https://git-scm.com/docs/git-cherry-pick

## 2. Apa yang penyebab dari konflik tersebut?
Konflik muncul saat `git merge tutorial6-for-merge` ke `feat/tutorial-6` karena kedua branch melakukan perubahan pada bagian/baris yang sama di `tutorial-6/index.vue`. Karena commit “add conflict text at feat/tutorial-6” dan “tutorial6: add text at tutorial6-for-merge” memiliki perubahan dibagian yang sama (overlapping changes), sehingga Git tidak bisa menggabungkan otomatis dan menandai file dengan penanda konflik (`<<<<<<<`, `=======`, `>>>>>>>`).  

Referensi: https://git-scm.com/docs/git-merge

## 3. Jelaskan perbedaan dari "rebase --continue", "rebase --skip", dan "rebase --abort"!
- rebase --continue: Dilanjutkan setelah konflik pada commit saat ini diselesaikan dan perubahan sudah di-stage (git add). Git menerapkan commit berikutnya dalam rangkaian rebase.
- rebase --skip: Melewati commit yang sedang bermasalah (tidak diterapkan ke hasil rebase) dan lanjut ke commit berikutnya.
- rebase --abort: Membatalkan proses rebase dan mengembalikan working tree serta HEAD ke keadaan sebelum rebase dimulai.

referensi: https://git-scm.com/docs/git-rebase

## 4. Apa perbedaan Git Merge dengan Git Rebase? Buatlah/carilah ilustrasi yang dapat menggambarkan perbedaanya! Anda bisa menggunakan commit history (git log-oneline) Anda setelah melakukan rebase.
- Merge: Menggabungkan dua riwayat dan membuat “merge commit” baru (dua parent). Riwayat tetap bercabang, tidak mengubah kode SHA commit lama. 
- Rebase: Memindahkan/menulis ulang commit di atas base baru sehingga riwayat jadi linear. Mengubah SHA commit yang di‑rebase. 

Ilustrasi riwayat:
Rebase:
```
* e2f3c1e (HEAD -> feat/tutorial-6) tutorial6: add text at tutorial6-for-merge
* 64a974e add conflict text at feat/tutorial-6
* c9d8e7f (origin/main, main) chore: update docs
* b8a7c6d feat(tutorial-4): Menyelesaikan latihan fitur post
* a1b2c3d init: initialize project
```
Merge:
```
*   f0e1d2c (HEAD -> feat/tutorial-6) Merge branch 'tutorial6-for-merge' into feat/tutorial-6
|\  
| * 46f08c4 (tutorial6-for-merge) tutorial6: add text at tutorial6-for-merge
* | 64a974e add conflict text at feat/tutorial-6
|/  
* c9d8e7f (origin/main, main) chore: update docs
* b8a7c6d feat(tutorial-4): Menyelesaikan latihan fitur post
* a1b2c3d init: initialize project
```
referensi: https://www.atlassian.com/git/tutorials/merging-vs-rebasing

## 5. Mengapa hal pada langkah no 4 bisa terjadi? Mengapa git stash menjadi solusinya? Bagaimana jika kita tidak melakukan Git Stash Pop?
- Saat checkout ke branch lain, ada perubahan lokal yang ada pada `tutorial-6/git-stash/stash.vue` yang akan tertimpa oleh isi branch tujuan. Jadi, git memblokir checkout untuk mencegah hilangnya perubahan yang belum ter-commit.
- Git stash menjadi solusinya karena `git stash` menyimpan snapshot perubahan di working directory dan index ke stack “stash”, lalu membersihkan working tree sehingga checkout/merge/rebase bisa dilakukan tanpa konflik. Setelah pindah branch, perubahan bisa dikembalikan.
- Jika tidak melakukan git stash pop, maka perubahan tetap aman di stack stash dan tidak muncul di working tree/cabang mana pun. Jadi, perubahan itu tidak ikut ter-commit.

referensi: https://git-scm.com/docs/git-stash

## 6. Sebutkan dan jelaskan tiga tipe dari Git Reset
`git reset --soft` hanya memindahkan HEAD ke commit target dan membiarkan index serta working directory tetap seperti kondisi sekarang; ini berguna ketika ingin menggabungkan beberapa commit terakhir menjadi satu commit baru. `git reset --mixed` (default) memindahkan HEAD sekaligus menyelaraskan index ke commit target namun tidak mengubah working directory, sehingga perubahan file tetap ada tetapi menjadi un-staged; mode ini cocok untuk “unstage” perubahan atau memecah commit. `git reset --hard` memindahkan HEAD, mengubah index, dan menyamakan working directory dengan commit target; semua perubahan lokal yang belum disimpan akan hilang, sehingga harus digunakan dengan sangat hati-hati. 

referensi: https://git-scm.com/docs/git-reset

## 7. Apa itu git revert? Apa perbedaanya dengan git reset?
Git revert itu membatalkan perubahan dengan cara membuat commit baru yang membalikkan efek commit tertentu, sehingga riwayat tetap utuh. Jadi, dia seperti menghapus commit tertentu yang kita inginkan. Sedangkan, git reset memindahkan HEAD/branch ke commit lain dan menyesuaikan index serta working tree sesuai mode (`--soft`, `--mixed`, `--hard`). Jadi, dengan git reset ini kita seperti kembali ke versi yang sebelumnya.

referensi: https://www.atlassian.com/git/tutorials/resetting-checking-out-and-reverting

## 8. Buatlah grafik yang menggambarkan alur commit pada bagian Git Flow and Branching ini serta jelaskan! Grafik dapat berupa tulis tangan maupun menggunakan software. 
![Grafik No 8](docs/images/no8.jpg)
Pertama, branch development dibuat dari main yang sudah up-to-date, lalu menambahkan file base.vue. Lalu, branch feature-a dibuat dari development, kemudian mengedit base.vue dengan menambahkan "This line is from feature-a". Kemudian, branch feature-a di-push dan di-merge ke development. Lalu, branch feature-b juga dibuat dari development versi lokal, dan mengedit base.vue dengan menambahkan "This line is from feature-b". Kemudian, branch feature-b di-push dan di-merge ke development. Namun, saat melakukan git pull origin development --rebase, terjadi CONFLICT karena feature-a dan feature-b mengedit baris yang sama di base.vue Conflict diselesaikan dengan menerima kedua perubahan (accept both changes), membuat commit baru, lalu melanjutkan rebase dengan git rebase --continue. Setelah conflict selesai, feature-b di-push dan di-merge ke development.

referensi: https://git-scm.com/docs/git-merge, https://git-scm.com/docs/git-rebase

## 9. Kalian diminta untuk membuat skenario kerja repositori Front End tim dalam proyek tugas kelompok APAP yang menggunakan Git Flow dan Branching Strategy. Buatlah grafik bayangan yang akan menggambarkan alur commit kalian hingga branch main yang siap untuk dideploy. Catatan: Asumsikan terdapat 5 orang yang akan mengakses repositori tersebut yaitu orang A-E.
Contoh skenario kerja repository front end tim tugas kelompok APAP:
![No 9](docs/images/no9.jpg)
Proyek dimulai dari cabang utama yang berfungsi sebagai versi stabil untuk rilis (produksi). Dari main, dibuat cabang pengembangan sebagai cabang utama tempat seluruh fitur dikembangkan dan diuji sebelum digabungkan ke produksi. Setiap anggota tim (A–E) memiliki cabang fitur masing-masing, misalnya feat-a, feat-b, feat-c, feat-d, dan feat-e. Setiap fitur cabang berisi serangkaian commit yang menggambarkan perkembangan fitur. Setelah fitur selesai, cabang tersebut di-merge ke pengembangan melalui merge request (Merge A–E). Setelah beberapa fitur digabung dan diuji di pengembangan, cabang ini kemudian di-merge ke main untuk membuat versi rilis baru (contohnya v1.1.0). Pada salah satu proses integrasi, jika terjadi konflik di cabang feat, maka selesaikan conflict. Jika semua fitur sudah jadi, dan sudah di push ke development, dan tidak ada error, maka merge development ke main untuk versi final.



![Screenshot](docs/images/screenshot1.png)
