-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`país`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`país` (
  `idpaís` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`idpaís`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`estado` (
  `idestado` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  PRIMARY KEY (`idestado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`pais_estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`pais_estado` (
  `estado_idestado` INT NOT NULL,
  `país_idpaís` INT NOT NULL,
  INDEX `fk_pais_estado_estado1_idx` (`estado_idestado` ASC) VISIBLE,
  INDEX `fk_pais_estado_país1_idx` (`país_idpaís` ASC) VISIBLE,
  CONSTRAINT `fk_pais_estado_estado1`
    FOREIGN KEY (`estado_idestado`)
    REFERENCES `mydb`.`estado` (`idestado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pais_estado_país1`
    FOREIGN KEY (`país_idpaís`)
    REFERENCES `mydb`.`país` (`idpaís`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`municipio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`municipio` (
  `idmunicipio` INT NOT NULL,
  `nombre` VARCHAR(60) NULL,
  PRIMARY KEY (`idmunicipio`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`estado_municipio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`estado_municipio` (
  `municipio_idmunicipio` INT NOT NULL,
  `estado_idestado` INT NOT NULL,
  INDEX `fk_estado_municipio_municipio1_idx` (`municipio_idmunicipio` ASC) VISIBLE,
  INDEX `fk_estado_municipio_estado1_idx` (`estado_idestado` ASC) VISIBLE,
  CONSTRAINT `fk_estado_municipio_municipio1`
    FOREIGN KEY (`municipio_idmunicipio`)
    REFERENCES `mydb`.`municipio` (`idmunicipio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_estado_municipio_estado1`
    FOREIGN KEY (`estado_idestado`)
    REFERENCES `mydb`.`estado` (`idestado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`direccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`direccion` (
  `iddirección` INT NOT NULL,
  `calle` VARCHAR(45) NULL,
  `cp` VARCHAR(45) NULL,
  `no. int` VARCHAR(45) NULL,
  `no. ext` VARCHAR(45) NULL,
  `colonia` VARCHAR(45) NULL,
  PRIMARY KEY (`iddirección`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`direccion_municipio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`direccion_municipio` (
  `direccion_iddirección` INT NOT NULL,
  `municipio_idmunicipio` INT NOT NULL,
  INDEX `fk_direccion_municipio_direccion1_idx` (`direccion_iddirección` ASC) VISIBLE,
  INDEX `fk_direccion_municipio_municipio1_idx` (`municipio_idmunicipio` ASC) VISIBLE,
  CONSTRAINT `fk_direccion_municipio_direccion1`
    FOREIGN KEY (`direccion_iddirección`)
    REFERENCES `mydb`.`direccion` (`iddirección`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_direccion_municipio_municipio1`
    FOREIGN KEY (`municipio_idmunicipio`)
    REFERENCES `mydb`.`municipio` (`idmunicipio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuario` (
  `idusuario` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  `apellido materno` VARCHAR(45) NULL,
  `apellido paterno` VARCHAR(45) NULL,
  `contrasena` VARCHAR(1024) NULL,
  `telefono` VARCHAR(10) NULL,
  `correo` VARCHAR(50) NULL,
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`solicitud`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`solicitud` (
  `idsolicitud` INT NOT NULL,
  `monto` INT NULL,
  `meses` INT NULL,
  `interes` INT NULL,
  PRIMARY KEY (`idsolicitud`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`usuario_solicitud`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuario_solicitud` (
  `solicitud_idsolicitud` INT NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  INDEX `fk_usuario_solicitud_solicitud_idx` (`solicitud_idsolicitud` ASC) VISIBLE,
  INDEX `fk_usuario_solicitud_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_solicitud_solicitud`
    FOREIGN KEY (`solicitud_idsolicitud`)
    REFERENCES `mydb`.`solicitud` (`idsolicitud`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_solicitud_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `mydb`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`usuario_direccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuario_direccion` (
  `usuario_idusuario` INT NOT NULL,
  `direccion_iddirección` INT NOT NULL,
  INDEX `fk_usuario_direccion_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  INDEX `fk_usuario_direccion_direccion1_idx` (`direccion_iddirección` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_direccion_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `mydb`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_direccion_direccion1`
    FOREIGN KEY (`direccion_iddirección`)
    REFERENCES `mydb`.`direccion` (`iddirección`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`empleado` (
  `idempleado` INT NOT NULL,
  `nombre` VARCHAR(45) NULL,
  `usuario` VARCHAR(45) NULL,
  `contrasena` VARCHAR(45) NULL,
  PRIMARY KEY (`idempleado`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
