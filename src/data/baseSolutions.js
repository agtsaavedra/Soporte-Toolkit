export const solutions = [
  {
    id: 1,
    title: "Outlook lento / OST grande",
    category: "Outlook / Office",
    tags: ["Outlook", "OST", "Office", "Disco"],
    risk: "Bajo",
    time: "10-20 min",
    powershell: true,
    symptoms: [
      "Outlook tarda en abrir",
      "Se cuelga al cambiar de carpeta",
      "El disco C tiene poco espacio",
      "El archivo OST pesa varios GB"
    ],
    causes: [
      "Caché configurada por demasiados meses",
      "OST demasiado grande o dañado",
      "Complementos de Outlook generando lentitud",
      "Perfil de Outlook corrupto"
    ],
    steps: [
      "Verificar espacio libre en disco C.",
      "Revisar tamaño del OST del usuario.",
      "Bajar caché de Outlook a 3 meses.",
      "Probar Outlook en modo seguro.",
      "Si sigue fallando, crear perfil nuevo de Outlook."
    ],
    commands: [
      "outlook.exe /safe",
      "control mlcfg32.cpl",
      "Get-ChildItem $env:LOCALAPPDATA\\Microsoft\\Outlook -Filter *.ost | Select Name,@{Name='GB';Expression={[math]::Round($_.Length/1GB,2)}}"
    ],
    userMessage:
      "Vamos a revisar el tamaño del archivo local de Outlook y ajustar la sincronización para que no descargue tantos correos en la PC.",
    internalNotes:
      "Antes de crear perfil nuevo, validar si el usuario tiene PST locales o reglas importantes."
  },
  {
    id: 2,
    title: "Quitar WPS Office por PowerShell",
    category: "Software",
    tags: ["WPS", "Office", "PowerShell", "Desinstalación"],
    risk: "Medio",
    time: "10-20 min",
    powershell: true,
    symptoms: [
      "Los documentos se abren con WPS.",
      "Word, Excel o PDF quedan asociados a WPS.",
      "El usuario confunde WPS con Office.",
      "WPS aparece instalado aunque no corresponde."
    ],
    causes: [
      "WPS instalado por error.",
      "Asociaciones de archivo tomadas por WPS.",
      "Instalación por usuario y no global.",
      "Office instalado pero no predeterminado."
    ],
    steps: [
      "Cerrar documentos abiertos.",
      "Buscar WPS en programas instalados.",
      "Intentar desinstalación silenciosa si se encuentra UninstallString.",
      "Revisar si quedó carpeta en Program Files o AppData.",
      "Restaurar aplicaciones predeterminadas para Office/PDF.",
      "Probar apertura de .docx, .xlsx y .pdf."
    ],
    commands: [
      "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object {$_.DisplayName -like '*WPS*'} | Select DisplayName,DisplayVersion,UninstallString",
      "Get-AppxPackage *WPS* | Select Name,PackageFullName",
      "Get-AppxPackage *WPS* | Remove-AppxPackage",
      "$wps = Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object {$_.DisplayName -like '*WPS*'}; $wps | Select DisplayName,UninstallString",
      "ms-settings:defaultapps"
    ],
    userMessage:
      "Voy a quitar WPS y dejar Office como aplicación predeterminada para evitar problemas al abrir documentos.",
    internalNotes:
      "Ojo: muchas veces WPS se instala por usuario. Revisar también AppData si no aparece en HKLM."
  },
  {
    id: 3,
    title: "Desinstalar software por nombre",
    category: "Software",
    tags: ["PowerShell", "Uninstall", "Software", "Programas"],
    risk: "Medio",
    time: "10-20 min",
    powershell: true,
    symptoms: [
      "Hay que quitar un programa instalado.",
      "No se sabe si está en 32 o 64 bits.",
      "No aparece claro desde Configuración.",
      "Se necesita obtener el UninstallString."
    ],
    causes: [
      "Software instalado vía MSI o EXE.",
      "Entrada de desinstalación en registro.",
      "Instalación por usuario o por equipo."
    ],
    steps: [
      "Buscar el programa por nombre.",
      "Copiar el UninstallString.",
      "Validar si es MSI o EXE.",
      "Si es MSI, usar msiexec con el GUID.",
      "Si es EXE, revisar parámetros silenciosos antes de ejecutar.",
      "Reiniciar si corresponde."
    ],
    commands: [
      "$name = '*NOMBRE*'; Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object {$_.DisplayName -like $name} | Select DisplayName,DisplayVersion,Publisher,UninstallString",
      "msiexec /x {GUID} /qn /norestart",
      "Get-AppxPackage *NOMBRE* | Remove-AppxPackage"
    ],
    userMessage:
      "Voy a revisar cómo está instalado el programa para quitarlo de forma segura.",
    internalNotes:
      "Evitar Win32_Product salvo último recurso porque puede disparar reparaciones MSI."
  },
  {
    id: 4,
    title: "DNS pegados / volver a DHCP",
    category: "Red",
    tags: ["DNS", "DHCP", "Red", "PowerShell"],
    risk: "Medio",
    time: "5-10 min",
    powershell: true,
    symptoms: [
      "El equipo tiene DNS manuales.",
      "No resuelve nombres internos.",
      "VPN o recursos corporativos no funcionan.",
      "El usuario está en una red distinta y conserva DNS viejos."
    ],
    causes: [
      "DNS configurados manualmente.",
      "Adaptador con configuración vieja.",
      "Cambio de red o VPN.",
      "Configuración IP no automática."
    ],
    steps: [
      "Listar adaptadores activos.",
      "Ver DNS configurados.",
      "Cambiar DNS a automático por DHCP.",
      "Renovar IP si corresponde.",
      "Limpiar caché DNS.",
      "Probar resolución nuevamente."
    ],
    commands: [
      "Get-DnsClientServerAddress | Where-Object {$_.AddressFamily -eq 2}",
      "Get-NetAdapter | Where-Object {$_.Status -eq 'Up'}",
      "Set-DnsClientServerAddress -InterfaceAlias 'Wi-Fi' -ResetServerAddresses",
      "Set-DnsClientServerAddress -InterfaceAlias 'Ethernet' -ResetServerAddresses",
      "ipconfig /flushdns",
      "ipconfig /renew",
      "Resolve-DnsName NOMBRE_EQUIPO"
    ],
    userMessage:
      "Voy a revisar la configuración DNS del equipo y dejarla automática si quedó pegada manualmente.",
    internalNotes:
      "Cambiar InterfaceAlias según corresponda: Wi-Fi, Ethernet, Ethernet 3, etc."
  },
  {
    id: 5,
    title: "Disco C lleno",
    category: "Disco / Perfiles",
    tags: ["Disco", "Perfiles", "Temp", "Papelera"],
    risk: "Medio",
    time: "15-30 min",
    powershell: true,
    symptoms: [
      "La PC muestra poco espacio disponible",
      "Windows funciona lento",
      "No se pueden instalar actualizaciones",
      "Outlook o Teams fallan por falta de espacio"
    ],
    causes: [
      "Perfiles viejos acumulados",
      "Papelera con muchos GB",
      "Temporales de Windows o usuario",
      "OneDrive/Google Drive con archivos descargados localmente"
    ],
    steps: [
      "Verificar espacio libre del disco C.",
      "Identificar carpetas más pesadas en C:\\Users.",
      "Vaciar papelera si corresponde.",
      "Limpiar temporales.",
      "Revisar perfiles viejos antes de borrar."
    ],
    commands: [
      "Get-PSDrive C",
      "Get-ChildItem C:\\Users -Directory -Force | ForEach-Object { $s=(Get-ChildItem $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum; [PSCustomObject]@{Carpeta=$_.Name;GB=[math]::Round($s/1GB,2)} } | Sort-Object GB -Descending",
      "Remove-Item \"$env:TEMP\\*\" -Recurse -Force -ErrorAction SilentlyContinue",
      "rd /s /q C:\\$Recycle.Bin"
    ],
    userMessage:
      "Vamos a revisar qué carpetas están ocupando más espacio antes de borrar nada, para evitar eliminar información importante.",
    internalNotes:
      "Cuidado con borrar perfiles activos o carpetas sincronizadas."
  },
  {
    id: 6,
    title: "Borrar perfiles viejos",
    category: "Disco / Perfiles",
    tags: ["Perfiles", "Usuarios", "Disco", "PowerShell"],
    risk: "Alto",
    time: "15-30 min",
    powershell: true,
    symptoms: [
      "Muchos perfiles acumulados en C:\\Users.",
      "Disco C con poco espacio.",
      "Usuarios que ya no usan la PC.",
      "Carpetas de perfiles muy pesadas."
    ],
    causes: [
      "Equipos compartidos por varios usuarios.",
      "Perfiles antiguos no eliminados.",
      "AppData con caché acumulada."
    ],
    steps: [
      "Listar perfiles existentes.",
      "Confirmar qué perfiles no deben borrarse.",
      "No borrar Public, Default ni usuarios activos.",
      "Verificar que el perfil no esté cargado.",
      "Borrar perfil seleccionado.",
      "Validar espacio recuperado."
    ],
    commands: [
      "Get-ChildItem C:\\Users -Directory -Force | Select Name,FullName,LastWriteTime",
      "Get-CimInstance Win32_UserProfile | Select LocalPath,LastUseTime,Loaded",
      "Get-CimInstance Win32_UserProfile | Where-Object {$_.LocalPath -like '*NOMBRE_PERFIL*'} | Remove-CimInstance",
      "Remove-Item 'C:\\Users\\NOMBRE_PERFIL' -Recurse -Force"
    ],
    userMessage:
      "Voy a revisar perfiles antiguos antes de borrar, para evitar eliminar información de un usuario activo.",
    internalNotes:
      "Preferir Remove-CimInstance sobre borrar carpeta a mano cuando se pueda. Confirmar siempre antes."
  },
  {
    id: 7,
    title: "Cerrar sesión de usuario",
    category: "Windows",
    tags: ["Usuario", "Sesión", "PowerShell", "Windows"],
    risk: "Medio",
    time: "5 min",
    powershell: true,
    symptoms: [
      "El usuario quedó logueado.",
      "Hay que liberar una sesión.",
      "Un proceso quedó atado a una sesión de usuario.",
      "No se puede reiniciar todavía la PC completa."
    ],
    causes: [
      "Sesión bloqueada.",
      "Usuario desconectado pero activo.",
      "Aplicaciones abiertas en segundo plano."
    ],
    steps: [
      "Listar sesiones activas.",
      "Identificar ID de sesión correcto.",
      "Confirmar con el usuario o soporte que se puede cerrar.",
      "Cerrar sesión con logoff.",
      "Validar que la sesión desapareció."
    ],
    commands: [
      "query user",
      "quser",
      "logoff ID_SESION",
      "shutdown /l"
    ],
    userMessage:
      "Voy a cerrar la sesión que quedó abierta. Es posible que se cierren programas que estén abiertos en esa sesión.",
    internalNotes:
      "No usar logoff sin confirmar ID. Cuidado con cerrar sesión equivocada."
  },
  {
    id: 8,
    title: "Reiniciar spooler y limpiar cola",
    category: "Impresoras",
    tags: ["Impresora", "Spooler", "Cola", "PowerShell"],
    risk: "Medio",
    time: "5-10 min",
    powershell: true,
    symptoms: [
      "El trabajo queda en cola.",
      "La impresora no imprime.",
      "La cola está trabada.",
      "Error al intentar eliminar trabajos."
    ],
    causes: [
      "Spooler trabado.",
      "Trabajo corrupto en cola.",
      "Driver o puerto con problema.",
      "Impresora offline."
    ],
    steps: [
      "Revisar estado del servicio Spooler.",
      "Detener Spooler.",
      "Eliminar archivos de cola.",
      "Iniciar Spooler.",
      "Probar impresión."
    ],
    commands: [
      "Get-Service Spooler",
      "Stop-Service Spooler -Force",
      "Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\* -Force -ErrorAction SilentlyContinue",
      "Start-Service Spooler",
      "Get-Printer"
    ],
    userMessage:
      "Voy a reiniciar el servicio de impresión y limpiar la cola para destrabar los trabajos pendientes.",
    internalNotes:
      "Esto borra trabajos pendientes de impresión. Avisar si había documentos importantes en cola."
  },
  {
    id: 9,
    title: "Agregar impresora compartida",
    category: "Impresoras",
    tags: ["Impresora", "PrintUI", "Servidor", "PowerShell"],
    risk: "Bajo",
    time: "5-10 min",
    powershell: true,
    symptoms: [
      "El usuario no tiene instalada una impresora.",
      "No aparece la impresora compartida.",
      "Se necesita agregar impresora desde servidor."
    ],
    causes: [
      "Perfil nuevo.",
      "Equipo nuevo.",
      "Impresora no agregada al usuario.",
      "Driver requerido desde servidor de impresión."
    ],
    steps: [
      "Confirmar nombre del recurso compartido.",
      "Probar acceso al servidor de impresión.",
      "Agregar impresora con PrintUI.",
      "Validar que aparezca en impresoras.",
      "Imprimir página de prueba si corresponde."
    ],
    commands: [
      "rundll32 printui.dll,PrintUIEntry /in /n \"\\\\srv-prs01\\NOMBRE_IMPRESORA\"",
      "Get-Printer",
      "Test-NetConnection srv-prs01 -Port 445"
    ],
    userMessage:
      "Voy a agregar la impresora compartida desde el servidor de impresión.",
    internalNotes:
      "Cambiar srv-prs01 y NOMBRE_IMPRESORA según el caso."
  },
  {
    id: 10,
    title: "FortiClient diagnóstico rápido",
    category: "VPN / FortiClient",
    tags: ["FortiClient", "VPN", "EMS", "PowerShell"],
    risk: "Medio",
    time: "10-20 min",
    powershell: true,
    symptoms: [
      "No aparece Remote Access.",
      "VPN no conecta.",
      "FortiClient no reporta a EMS.",
      "El equipo no toma configuración corporativa."
    ],
    causes: [
      "Servicio Fortinet detenido.",
      "FortiClient dañado.",
      "Sin conectividad a EMS.",
      "Telemetría no registrada."
    ],
    steps: [
      "Verificar servicios Fortinet.",
      "Verificar versión instalada.",
      "Probar conectividad a EMS.",
      "Revisar detalles de FortiESNAC si existe.",
      "Reinstalar o registrar telemetría si corresponde."
    ],
    commands: [
      "Get-Service | Where-Object {$_.Name -like '*Forti*'}",
      "Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' | Where-Object {$_.DisplayName -like '*FortiClient*'} | Select DisplayName, DisplayVersion",
      "Test-NetConnection fems.camuzzigas.com.ar -Port 8013",
      "Test-NetConnection fems.camuzzigas.com.ar -Port 10443",
      "\"C:\\Program Files\\Fortinet\\FortiClient\\FortiESNAC.exe\" -d"
    ],
    userMessage:
      "Voy a revisar si FortiClient está instalado completo, si sus servicios están activos y si comunica con EMS.",
    internalNotes:
      "Si el equipo está fuera de red corporativa, las pruebas contra EMS pueden fallar."
  },
  {
    id: 11,
    title: "InvGate no reporta",
    category: "InvGate",
    tags: ["InvGate", "Inventario", "Agente", "PowerShell"],
    risk: "Medio",
    time: "20-40 min",
    powershell: true,
    symptoms: [
      "El equipo no aparece actualizado en InvGate.",
      "El agente figura instalado pero no reporta.",
      "No actualiza inventario.",
      "El equipo aparece en listados pendientes."
    ],
    causes: [
      "Servicio detenido.",
      "Agente dañado.",
      "Problema de conexión a la nube.",
      "Equipo fuera de dominio o sin red corporativa."
    ],
    steps: [
      "Verificar instalación del agente.",
      "Revisar servicios relacionados.",
      "Probar conexión al endpoint cloud.",
      "Reinstalar agente si corresponde.",
      "Forzar reporte después de reinstalar."
    ],
    commands: [
      "Get-Service | Where-Object {$_.Name -like '*InvGate*'}",
      "Test-NetConnection camuzzi.is.cloud.invgate.net -Port 443",
      "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object {$_.DisplayName -like '*InvGate*'} | Select DisplayName,DisplayVersion,UninstallString"
    ],
    userMessage:
      "Voy a revisar si el agente de inventario está instalado, si el servicio está activo y si puede comunicarse con la nube.",
    internalNotes:
      "Si requiere reinstalación, usar el MSI corporativo y validar comunicación 443."
  },
  {
    id: 12,
    title: "Reporte rápido del equipo",
    category: "Inventario / Diagnóstico",
    tags: ["Inventario", "Equipo", "Serial", "PowerShell"],
    risk: "Bajo",
    time: "5 min",
    powershell: true,
    symptoms: [
      "Se necesita saber modelo, serial, RAM, usuario o sistema operativo.",
      "Hay que cargar datos en ticket.",
      "Se necesita diagnóstico inicial rápido."
    ],
    causes: [
      "Falta información del equipo.",
      "Ticket incompleto.",
      "Necesidad de inventario rápido."
    ],
    steps: [
      "Obtener nombre del equipo.",
      "Obtener usuario actual.",
      "Obtener modelo y serial.",
      "Obtener sistema operativo.",
      "Obtener RAM y disco."
    ],
    commands: [
      "hostname",
      "whoami",
      "Get-CimInstance Win32_ComputerSystem | Select Manufacturer,Model,TotalPhysicalMemory,UserName",
      "Get-CimInstance Win32_BIOS | Select SerialNumber",
      "Get-CimInstance Win32_OperatingSystem | Select Caption,Version,LastBootUpTime",
      "Get-PSDrive C"
    ],
    userMessage:
      "Voy a tomar algunos datos básicos del equipo para completar el diagnóstico.",
    internalNotes:
      "Ideal para copiar datos al ticket antes de escalar."
  },
  {
    id: 13,
    title: "Test de conectividad a equipo",
    category: "Red",
    tags: ["Ping", "Puertos", "DNS", "PowerShell"],
    risk: "Bajo",
    time: "5-10 min",
    powershell: true,
    symptoms: [
      "No se puede acceder a un equipo.",
      "DNS resuelve pero no conecta.",
      "No funciona admin share, WMI, RDP o WinRM.",
      "Se sospecha firewall, VLAN o DNS viejo."
    ],
    causes: [
      "Equipo fuera de red.",
      "DNS con IP vieja.",
      "Firewall bloqueando puertos.",
      "Segmentación entre subredes.",
      "VPN desconectada."
    ],
    steps: [
      "Resolver nombre DNS.",
      "Probar ping.",
      "Probar puerto 445 para SMB.",
      "Probar puerto 135 para RPC/WMI.",
      "Probar puerto 3389 para RDP.",
      "Probar puerto 5985 para WinRM.",
      "Interpretar resultado."
    ],
    commands: [
      "Resolve-DnsName NOMBRE_EQUIPO",
      "ping NOMBRE_EQUIPO",
      "Test-NetConnection NOMBRE_EQUIPO -Port 445",
      "Test-NetConnection NOMBRE_EQUIPO -Port 135",
      "Test-NetConnection NOMBRE_EQUIPO -Port 3389",
      "Test-NetConnection NOMBRE_EQUIPO -Port 5985"
    ],
    userMessage:
      "Voy a probar conectividad básica contra el equipo para ver si está accesible desde esta red.",
    internalNotes:
      "Si falla todo pero el equipo está encendido, revisar IP real, VPN, VLAN o DNS stale."
  },
  {
    id: 14,
    title: "Office reparación completa",
    category: "Outlook / Office",
    tags: ["Office", "Reparación", "Excel", "Outlook"],
    risk: "Bajo",
    time: "20-40 min",
    powershell: true,
    symptoms: [
      "Office abre con errores.",
      "Excel o Outlook se cierran.",
      "Aplicaciones Office lentas o dañadas.",
      "La reparación rápida no alcanza."
    ],
    causes: [
      "Instalación Click-to-Run dañada.",
      "Archivos de Office corruptos.",
      "Actualización fallida.",
      "Complementos conflictivos."
    ],
    steps: [
      "Cerrar aplicaciones Office.",
      "Probar modo seguro si aplica.",
      "Ejecutar reparación rápida.",
      "Si no mejora, ejecutar reparación online.",
      "Reiniciar equipo y validar."
    ],
    commands: [
      "appwiz.cpl",
      "outlook.exe /safe",
      "excel.exe /safe",
      "\"C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE\" /regserver"
    ],
    userMessage:
      "Vamos a reparar la instalación de Office. Puede demorar unos minutos y conviene cerrar Word, Excel y Outlook antes de empezar.",
    internalNotes:
      "Si el equipo está con poca conexión, advertir que reparación online puede tardar bastante."
  },
  {
    id: 15,
    title: "OneDrive ocupando espacio",
    category: "Disco / Perfiles",
    tags: ["OneDrive", "Espacio", "Sincronización", "Disco"],
    risk: "Bajo",
    time: "10-20 min",
    powershell: true,
    symptoms: [
      "OneDrive ocupa mucho espacio local.",
      "El disco C se llena.",
      "Archivos sincronizados aparecen descargados en el equipo.",
      "El usuario no necesita tener todo offline."
    ],
    causes: [
      "Archivos marcados como disponibles en este dispositivo.",
      "Carpetas pesadas sincronizadas localmente.",
      "Papelera de OneDrive o Windows con acumulación."
    ],
    steps: [
      "Revisar tamaño de carpeta OneDrive.",
      "Identificar carpetas pesadas.",
      "Usar 'Liberar espacio' sobre carpetas que no necesiten estar offline.",
      "Verificar que los archivos queden solo en la nube.",
      "Vaciar papelera si corresponde."
    ],
    commands: [
      "Get-ChildItem $env:USERPROFILE\\OneDrive -Directory -Force | Select Name,FullName",
      "Get-PSDrive C",
      "cleanmgr"
    ],
    userMessage:
      "Vamos a liberar espacio dejando archivos de OneDrive solo en la nube cuando no sea necesario tenerlos descargados en la PC.",
    internalNotes:
      "No desincronizar ni borrar sin confirmar con el usuario qué carpetas usa."
  },
  {
    id: 16,
    title: "SAP GUI - Configuración CGP",
    category: "SAP",
    tags: ["SAP", "SAP GUI", "CGP", "Servidor"],
    risk: "Bajo",
    time: "5-10 min",
    powershell: false,
    symptoms: [
      "El usuario no tiene creada la entrada de SAP.",
      "No aparece CGP en SAP Logon.",
      "SAP no conecta por falta de configuración."
    ],
    causes: [
      "SAP GUI recién instalado.",
      "Entrada de sistema no creada.",
      "Datos de conexión incompletos."
    ],
    steps: [
      "Abrir SAP Logon.",
      "Crear una nueva entrada de sistema.",
      "Seleccionar 'Servidor de aplicación específico de usuario'.",
      "Completar Descripción: CGP.",
      "Completar ID sistema: CGP.",
      "Completar Número de instancia: 00.",
      "Dejar vacío String de SAProuter si no corresponde.",
      "Completar Servidor de aplicación: PRODU_SAP.",
      "Continuar y finalizar.",
      "Probar conexión."
    ],
    commands: ["saplogon.exe"],
    userMessage:
      "Voy a configurar la entrada de SAP CGP para que puedas acceder desde SAP Logon.",
    internalNotes:
      "Datos usados: Descripción CGP, ID CGP, instancia 00, servidor PRODU_SAP."
  },
  {
    id: 17,
    title: "AGSERVER / AS400 - Nueva sesión",
    category: "AS400 / IBM i",
    tags: ["AS400", "AGSERVER", "IBM i Access", "5250"],
    risk: "Bajo",
    time: "10-15 min",
    powershell: false,
    symptoms: [
      "El usuario no tiene acceso directo al AS400.",
      "No aparece la sesión AGSERVER.",
      "Se necesita crear una nueva sesión 5250."
    ],
    causes: [
      "Equipo nuevo.",
      "Perfil local sin accesos directos.",
      "IBM i Access instalado pero sin sesión configurada."
    ],
    steps: [
      "Abrir IBM i Access / Personal Communications.",
      "Crear una nueva sesión 5250.",
      "Configurar el nombre del sistema como AGSERVER.",
      "Elegir tipo de emulación Pantalla.",
      "Guardar la sesión con nombre claro, por ejemplo AGSERVER.ws.",
      "Crear acceso directo en el escritorio si corresponde.",
      "Abrir la sesión y validar pantalla de login."
    ],
    commands: [
      "Buscar 'IBM i Access' en Inicio",
      "Buscar archivos .ws existentes en el perfil del usuario si hay que copiar una sesión previa"
    ],
    userMessage:
      "Voy a crear una nueva sesión de AS400 para que puedas acceder al sistema AGSERVER desde este equipo.",
    internalNotes:
      "Si hay una sesión funcional en otra PC, conviene copiar el .ws y ajustar acceso directo."
  },
  {
    id: 18,
    title: "Tickeadora Epson TM-U220",
    category: "Ticketeadoras",
    tags: ["Epson", "TM-U220", "Tickeadora", "IBM i", "PC5250"],
    risk: "Medio",
    time: "30-45 min",
    powershell: true,
    symptoms: [
      "La tickeadora no imprime.",
      "No aparece la Epson TM-U220.",
      "La sesión de impresora IBM i no conecta.",
      "El ticket no sale desde AS400."
    ],
    causes: [
      "Driver Epson no instalado.",
      "La tickeadora se encendió antes de terminar el driver.",
      "Puerto USB mal creado.",
      "Sesión PC5250 de impresora mal configurada.",
      "Impresora incorrecta seleccionada en la sesión."
    ],
    steps: [
      "Conectar la tickeadora por USB y alimentación, pero no encenderla hasta terminar la instalación del driver.",
      "Instalar Epson Advanced Printer Driver 4 desde APD_412E.exe.",
      "En Setup Type elegir Custom.",
      "Dejar marcados Local Port Support, 32 bit printer driver, Status API y Devmode API.",
      "En Local Port Support dejar marcado Automatically install detected USB devices.",
      "En Printer Configuration elegir Add.",
      "Seleccionar driver EPSON TM-U220 Receipt.",
      "Usar Port Type: Create a USB port.",
      "Finalizar instalación y recién ahí encender/probar la tickeadora.",
      "Configurar acceso directo de IBM i Access para conectar la tickeadora con el host.",
      "En PC5250 usar sistema 10.0.1.24.",
      "Especificar ID de estación de trabajo: EPSONTM.",
      "Seleccionar tipo de emulación Impresora.",
      "Usar cola de mensajes QSYSOPR y biblioteca *LIBL.",
      "Activar transformar datos de impresión a ASCII en System i.",
      "Modelo de impresora: *NONE.",
      "Seleccionar la impresora EPSON TM-U220 Receipt activa.",
      "Validar que la sesión quede conectada/en línea."
    ],
    commands: [
      "\\\\arfile01\\soporte$\\Software\\Intel\\Drivers y firmwares\\Impresoras y Multifuncion\\Epson\\APD_412E.zip",
      "control printers",
      "Get-Printer | Where-Object {$_.Name -like '*EPSON*'}"
    ],
    userMessage:
      "Voy a instalar y configurar la tickeadora Epson para que quede asociada a la sesión de impresión del AS400.",
    internalNotes:
      "Importante: no encender la tickeadora antes de terminar el driver. En PC5250 el ID de estación usado en la guía es EPSONTM."
  },
  {
    id: 19,
    title: "DebMedia Player - Configuración",
    category: "DebMedia",
    tags: ["DebMedia", "Player", "Check-in", "Turnos", "Pantalla"],
    risk: "Medio",
    time: "20-30 min",
    powershell: false,
    symptoms: [
      "La pantalla de check-in no funciona.",
      "DebMedia abre sin configuración.",
      "No aparece la pantalla para ingresar DNI.",
      "Hay más de una PC intentando usar el check-in."
    ],
    causes: [
      "Carpeta no descomprimida.",
      "Acceso directo creado al archivo incorrecto.",
      "Configuración de sucursal incompleta.",
      "Más de una máquina usando el player activamente.",
      "Datos de Screen ID o usuario incorrectos."
    ],
    steps: [
      "Descargar la carpeta del DebMedia Player desde el repositorio interno indicado.",
      "Descomprimir la carpeta antes de usarla.",
      "Guardar la carpeta en una ubicación estable.",
      "Crear acceso directo del ejecutable debPlayerWeb.",
      "Abrir el programa.",
      "Si inicia en pantalla completa, salir con ESC.",
      "Entrar a configuración con CTRL + Q.",
      "Completar Server URL según sucursal.",
      "Completar Screen ID según sucursal.",
      "Completar User Email según sucursal.",
      "Completar contraseña según procedimiento interno.",
      "Dejar el resto de la configuración igual al modelo.",
      "Guardar y validar que muestre la pantalla de ingreso de DNI.",
      "Recordar que solo debe quedar activo en una máquina."
    ],
    commands: ["CTRL + Q para abrir configuración", "ESC para salir de pantalla completa"],
    userMessage:
      "Voy a configurar DebMedia Player para que quede funcionando la pantalla de check-in de clientes.",
    internalNotes:
      "Solo puede estar activo en una máquina. No dejar varias PCs haciendo check-in a la vez."
  },
  {
    id: 20,
    title: "DebMedia Player - Datos por sucursal",
    category: "DebMedia",
    tags: ["DebMedia", "Screen ID", "Sucursal", "Configuración"],
    risk: "Bajo",
    time: "5-10 min",
    powershell: false,
    symptoms: [
      "No se sabe qué Screen ID usar.",
      "La sucursal carga pero no corresponde.",
      "El player queda asociado a otra oficina."
    ],
    causes: [
      "Screen ID incorrecto.",
      "Usuario de sucursal mal cargado.",
      "Configuración copiada de otra oficina."
    ],
    steps: [
      "Identificar la sucursal.",
      "Cargar Server URL: https://debqclients.debmedia.com/debsign.",
      "Cargar Screen ID según la sucursal.",
      "Cargar el correo correspondiente a la sucursal.",
      "Cargar contraseña según procedimiento interno.",
      "Guardar y probar pantalla."
    ],
    commands: [
      "Allen: Screen ID 3749 / televisor.allen@camuzzi.com",
      "Catriel: Screen ID 3761 / televisor.catriell@camuzzi.com",
      "Choele Choel: Screen ID 3753 / televisor.choelechoel@camuzzi.com",
      "Cinco Saltos: Screen ID 3755 / televisor.cincosaltos@camuzzi.com",
      "Cipolletti: Screen ID 2373 / televisor.cipolletti@camuzzi.com",
      "General Roca: Screen ID 2375 / televisor.generalroca@camuzzi.com",
      "Villa Regina: Screen ID 3759 / televisor.villaregina@camuzzi.com"
    ],
    userMessage:
      "Voy a revisar la sucursal y cargar el Screen ID correcto para que la pantalla quede asociada a la oficina correspondiente.",
    internalNotes:
      "No incluir contraseñas en la base pública del proyecto. Mantenerlas en procedimiento interno seguro."
  },
  {
    id: 21,
    title: "ROOTS / error de excepción",
    category: "Aplicaciones internas",
    tags: ["ROOTS", "Excepción", ".NET", "Aplicación interna"],
    risk: "Medio",
    time: "15-30 min",
    powershell: true,
    symptoms: [
      "La aplicación muestra error de excepción.",
      "Desde un usuario administrador funciona o cambia el comportamiento.",
      "El usuario común no puede abrir o ejecutar una función.",
      "El error aparece al iniciar o al seleccionar una opción."
    ],
    causes: [
      "Permisos insuficientes en carpeta de instalación.",
      "Configuración por usuario corrupta.",
      "Dependencia faltante de .NET o runtime.",
      "Archivos locales dañados.",
      "Ruta o recurso de red inaccesible."
    ],
    steps: [
      "Probar ejecutar como administrador para comparar comportamiento.",
      "Validar si el problema ocurre solo con un usuario o con todos.",
      "Revisar permisos de la carpeta de la aplicación.",
      "Renombrar carpeta de configuración del usuario si existe en AppData.",
      "Verificar si requiere .NET Framework o runtime específico.",
      "Revisar Visor de eventos para capturar detalle de la excepción.",
      "Si con admin funciona, revisar permisos sobre carpeta, archivos temporales o configuración local."
    ],
    commands: [
      "eventvwr.msc",
      "Get-ChildItem $env:APPDATA",
      "Get-ChildItem $env:LOCALAPPDATA",
      "whoami /groups",
      "Get-ChildItem 'C:\\Program Files' -Directory | Where-Object {$_.Name -like '*ROOTS*'}"
    ],
    userMessage:
      "Voy a revisar si el error viene por permisos, configuración del usuario o alguna dependencia de la aplicación.",
    internalNotes:
      "Ficha genérica para ROOTS/excepción. Completar luego con ruta exacta y captura específica."
  }
];
