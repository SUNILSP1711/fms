@echo off
rem Runs the backend using the repository-local Maven distribution.
pushd "%~dp0"
set "MAVEN_HOME=%~dp0..\apache-maven-3.9.6"
if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
  echo Local Maven not found at "%MAVEN_HOME%\bin\mvn.cmd".
  echo Please install Maven or update the path in run-backend.bat.
  popd
  exit /b 1
)
"%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run
popd
