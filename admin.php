<?php
session_start();
$admin_user = 'admin';
$admin_pass = '12345'; 

if (isset($_POST['login'])) {
    if ($_POST['username'] === $admin_user && $_POST['password'] === $admin_pass) {
        $_SESSION['auth'] = true;
    } else {
        $error = "Неверный логин или пароль";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin.php");
    exit;
}

$is_auth = isset($_SESSION['auth']) && $_SESSION['auth'] === true;
$db = new PDO('sqlite:wedding_db.sqlite');

if ($is_auth && isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $stmt = $db->prepare("DELETE FROM guests WHERE id = ?");
    $stmt->execute([$id]);
    header("Location: admin.php");
    exit;
}

if ($is_auth) {
    $total_forms = $db->query("SELECT COUNT(*) FROM guests")->fetchColumn();
    $confirmed = $db->query("SELECT COUNT(*) FROM guests WHERE attending = 'Да'")->fetchColumn();
    $declined = $db->query("SELECT COUNT(*) FROM guests WHERE attending = 'Нет'")->fetchColumn();
    $total_guests = $db->query("SELECT SUM(guest_count) FROM guests WHERE attending = 'Да'")->fetchColumn() ?: 0;
    $groom_side = $db->query("SELECT SUM(guest_count) FROM guests WHERE side = 'Жених' AND attending = 'Да'")->fetchColumn() ?: 0;
    $bride_side = $db->query("SELECT SUM(guest_count) FROM guests WHERE side = 'Невеста' AND attending = 'Да'")->fetchColumn() ?: 0;

    $guests = $db->query("SELECT * FROM guests ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Панель администратора</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .admin-box { max-width: 900px; margin: 40px auto; padding: 20px; text-align: left; background: #FFF; border: 1px solid #000; }
        .stats { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
        .stat-card { border: 1px solid #1A1A1A; padding: 15px; flex: 1; min-width: 130px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #DDD; text-align: left; }
        th { background: #1A1A1A; color: white; }
    </style>
</head>
<body>
    <?php if (!$is_auth): ?>
        <div class="rsvp-form" style="margin-top: 80px;">
            <h2>ВХОД В АДМИНКУ</h2>
            <?php if(isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
            <form action="admin.php" method="POST">
                <div class="form-group"><input type="text" name="username" placeholder="Логин" required></div>
                <div class="form-group"><input type="password" name="password" placeholder="Пароль" required></div>
                <button type="submit" name="login" class="btn-submit">Войти</button>
            </form>
        </div>
    <?php else: ?>
        <div class="admin-box">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>Панель управления</h2>
                <a href="admin.php?logout=1" style="color:#000;">Выйти</a>
            </div>
            <div class="stats">
                <div class="stat-card"><h3><?=$total_forms?></h3><p>Анкет всего</p></div>
                <div class="stat-card"><h3><?=$confirmed?></h3><p>Придут (семей)</p></div>
                <div class="stat-card"><h3><?=$declined?></h3><p>Отказы</p></div>
                <div class="stat-card"><h3><?=$total_guests?></h3><p>Всего гостей (чел)</p></div>
                <div class="stat-card"><h3><?=$groom_side?></h3><p>От Жениха</p></div>
                <div class="stat-card"><h3><?=$bride_side?></h3><p>От Невесты</p></div>
            </div>
            <table>
                <thead><tr><th>Имя</th><th>Сторона</th><th>Придет?</th><th>Кол-во</th><th>Пожелания</th><th>Действие</th></tr></thead>
                <tbody>
                    <?php foreach($guests as $g): ?>
                    <tr>
                        <td><?=htmlspecialchars($g['name'])?></td>
                        <td><?=$g['side']?></td>
                        <td><?=$g['attending']?></td>
                        <td><?=$g['guest_count']?></td>
                        <td><?=htmlspecialchars($g['wishes'])?></td>
                        <td><a href="admin.php?delete=<?=$g['id']?>" style="color:red;" onclick="return confirm('Удалить?')">Удалить</a></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</body>
</html>