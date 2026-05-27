while ($true) {
    $proc = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WorkingDirectory "C:\Users\Enco5\Dev\codigo-vibecoding-g2\task-manager-frontend"
    $proc.WaitForExit()
    Start-Sleep -Seconds 2
}