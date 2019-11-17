import * as ts from "typescript";

/**
 * Gets the compiler options from a specified tsconfig.json
 * @param filePath - File path to the tsconfig.json.
 * @param options - Options.
 */
export declare function getCompilerOptionsFromTsConfig(filePath: string, options?: CompilerOptionsFromTsConfigOptions): CompilerOptionsFromTsConfigResult;

export interface CompilerOptionsFromTsConfigOptions {
    encoding?: string;
    fileSystem?: FileSystemHost;
}

export interface CompilerOptionsFromTsConfigResult {
    options: CompilerOptions;
    errors: ts.Diagnostic[];
}

export declare class TsConfigResolver {
    private readonly fileSystem;
    private readonly encoding;
    private readonly host;
    private readonly tsConfigFilePath;
    private readonly tsConfigDirPath;
    constructor(fileSystem: TransactionalFileSystem, tsConfigFilePath: string, encoding: string);
    getCompilerOptions(): ts.CompilerOptions;
    getErrors(): ts.Diagnostic[];
    getPaths(compilerOptions?: CompilerOptions): {
        filePaths: string[];
        directoryPaths: string[];
    };
    private parseJsonConfigFileContent;
    private getTsConfigFileJson;
}

/**
 * Helper around a Map.
 * @remarks The use of this class is historical as it served as an abstraction around an ES5 based map and ES6, if available. Eventually
 * this class should be removed in favour of helper functions around a Map.
 */
export declare class KeyValueCache<T, U> {
    private readonly cacheItems;
    getSize(): number;
    getValues(): IterableIterator<U>;
    getValuesAsArray(): U[];
    getKeys(): IterableIterator<T>;
    getEntries(): IterableIterator<[T, U]>;
    getOrCreate<TCreate extends U = U>(key: T, createFunc: () => TCreate): TCreate;
    has(key: T): boolean;
    get(key: T): U | undefined;
    set(key: T, value: U): void;
    replaceKey(key: T, newKey: T): void;
    removeByKey(key: T): void;
    clear(): void;
}

/**
 * An array where the values are sorted by a key of one of the values.
 */
export declare class SortedKeyValueArray<TKey, TValue> {
    private readonly getKey;
    private readonly comparer;
    private readonly array;
    constructor(getKey: (value: TValue) => TKey, comparer: Comparer<TKey>);
    set(value: TValue): void;
    removeByValue(value: TValue): void;
    removeByKey(key: TKey): void;
    getArrayCopy(): TValue[];
    hasItems(): boolean;
    entries(): Generator<TValue, void, undefined>;
}

/**
 * A wrapper around WeakMap.
 * @remarks The use of this class is historical as it served as an abstraction around an ES5 based weak map and ES6, if available. Eventually
 * this class should be removed in favour of helper functions around a WeakMap.
 */
export declare class WeakCache<T extends object, U> {
    private readonly cacheItems;
    getOrCreate<TCreate extends U = U>(key: T, createFunc: () => TCreate): TCreate;
    has(key: T): boolean;
    get(key: T): U | undefined;
    set(key: T, value: U): void;
    removeByKey(key: T): void;
}

/**
 * Creates a language service host and compiler host.
 * @param options - Options for creating the hosts.
 */
export declare function createHosts(options: CreateHostsOptions): {
    languageServiceHost: ts.LanguageServiceHost;
    compilerHost: ts.CompilerHost;
};

/**
 * Options for creating the hosts.
 */
export interface CreateHostsOptions {
    /** The transactional file system to use. */
    transactionalFileSystem: TransactionalFileSystem;
    /** Container of source files to use. */
    sourceFileContainer: TsSourceFileContainer;
    /** Compiler options container to use. */
    compilerOptions: CompilerOptionsContainer;
    /** Newline kind to use. */
    getNewLine: () => "\r\n" | "\n";
    /** The resolution host used for resolving modules and type reference directives. */
    resolutionHost: ResolutionHost;
}

/**
 * Creates a module resolution host based on the provided options.
 * @param options - Options for creating the module resolution host.
 */
export declare function createModuleResolutionHost(options: CreateModuleResolutionHostOptions): ts.ModuleResolutionHost;

/**
 * Options for creating a module resolution host.
 */
export interface CreateModuleResolutionHostOptions {
    /** The transactional file system to use. */
    transactionalFileSystem: TransactionalFileSystem;
    /** The source file container to use. */
    sourceFileContainer: TsSourceFileContainer;
    /** Gets the encoding to use. */
    getEncoding(): string;
}

/**
 * An implementation of a ts.DocumentRegistry that uses a transactional file system.
 */
export declare class DocumentRegistry implements ts.DocumentRegistry {
    private readonly transactionalFileSystem;
    private readonly sourceFileCacheByFilePath;
    private static readonly initialVersion;
    /**
     * Constructor.
     * @param transactionalFileSystem - The transaction file system to use.
     */
    constructor(transactionalFileSystem: TransactionalFileSystem);
    /**
     * Removes the source file from the document registry
     * @param fileName - File name to remove.
     */
    removeSourceFile(fileName: string): void;
    /**
     * Creates or updates a source file in the document registry.
     * @param fileName - File name to create or update.
     * @param compilationSettings - Compiler options to use.
     * @param scriptSnapshot - Script snapshot (text) of the file.
     * @param scriptKind - Script kind of the file.
     */
    createOrUpdateSourceFile(fileName: string, compilationSettings: CompilerOptions, scriptSnapshot: ts.IScriptSnapshot, scriptKind: ScriptKind | undefined): ts.SourceFile;
    /** @inheritdoc */
    acquireDocument(fileName: string, compilationSettings: CompilerOptions, scriptSnapshot: ts.IScriptSnapshot, version: string, scriptKind: ScriptKind | undefined): ts.SourceFile;
    /** @inheritdoc */
    acquireDocumentWithKey(fileName: string, path: ts.Path, compilationSettings: CompilerOptions, key: ts.DocumentRegistryBucketKey, scriptSnapshot: ts.IScriptSnapshot, version: string, scriptKind: ScriptKind | undefined): ts.SourceFile;
    /** @inheritdoc */
    updateDocument(fileName: string, compilationSettings: CompilerOptions, scriptSnapshot: ts.IScriptSnapshot, version: string, scriptKind: ScriptKind | undefined): ts.SourceFile;
    /** @inheritdoc */
    updateDocumentWithKey(fileName: string, path: ts.Path, compilationSettings: CompilerOptions, key: ts.DocumentRegistryBucketKey, scriptSnapshot: ts.IScriptSnapshot, version: string, scriptKind: ScriptKind | undefined): ts.SourceFile;
    /** @inheritdoc */
    getKeyForCompilationSettings(settings: CompilerOptions): ts.DocumentRegistryBucketKey;
    /** @inheritdoc */
    releaseDocument(fileName: string, compilationSettings: CompilerOptions): void;
    /** @inheritdoc */
    releaseDocumentWithKey(path: ts.Path, key: ts.DocumentRegistryBucketKey): void;
    /** @inheritdoc */
    reportStats(): string;
    /** @inheritdoc */
    getSourceFileVersion(sourceFile: ts.SourceFile): any;
    private getNextSourceFileVersion;
    private updateSourceFile;
    private createCompilerSourceFile;
}

/** Host for implementing custom module and/or type reference directive resolution. */
export interface ResolutionHost {
    resolveModuleNames?: ts.LanguageServiceHost["resolveModuleNames"];
    getResolvedModuleWithFailedLookupLocationsFromCache?: ts.LanguageServiceHost["getResolvedModuleWithFailedLookupLocationsFromCache"];
    resolveTypeReferenceDirectives?: ts.LanguageServiceHost["resolveTypeReferenceDirectives"];
}

/**
 * Factory used to create a resolution host.
 * @remarks The compiler options are retrieved via a function in order to get the project's current compiler options.
 */
export declare type ResolutionHostFactory = (moduleResolutionHost: ts.ModuleResolutionHost, getCompilerOptions: () => ts.CompilerOptions) => ResolutionHost;

/**
 * A container of source files.
 */
export interface TsSourceFileContainer {
    /**
     * Gets if a source file exists at the specified file path.
     * @param filePath - File path to check.
     */
    containsSourceFileAtPath(filePath: string): boolean;
    /**
     * Gets the source file paths of all the source files in the container.
     */
    getSourceFilePaths(): string[];
    /**
     * Gets a source file from a file path, but only if it exists in the container's cache.
     * @param filePath - File path to get the source file from.
     */
    getSourceFileFromCacheFromFilePath(filePath: string): ts.SourceFile | undefined;
    /**
     * Adds or gets a source file from a file path.
     * @param filePath - File path to get.
     * @param opts - Options for adding or getting the file.
     */
    addOrGetSourceFileFromFilePath(filePath: string, opts: {
        markInProject: boolean;
        scriptKind: ScriptKind | undefined;
    }): ts.SourceFile | undefined;
    /**
     * Gets the source file version of the specified source file.
     * @param sourceFile - Source file to inspect.
     */
    getSourceFileVersion(sourceFile: ts.SourceFile): string;
    /**
     * Gets if the container contains the specified directory.
     * @param dirPath - Path of the directory to check.
     */
    containsDirectoryAtPath(dirPath: string): boolean;
    /**
     * Gets the child directories of the specified directory.
     * @param dirPath - Path of the directory to check.
     */
    getChildDirectoriesOfDirectory(dirPath: string): string[];
}

/**
 * Compares two values specifying the sort order.
 */
export interface Comparer<T> {
    /**
     * Checks the two items returning -1 if `a` preceeds, 0 if equal, and 1 if `a` follows.
     * @param a - Item to use.
     * @param b - Item to compare with.
     */
    compareTo(a: T, b: T): number;
}

/**
 * Converts a comparer to a stored comparer.
 */
export declare class ComparerToStoredComparer<T> implements StoredComparer<T> {
    private readonly comparer;
    private readonly storedValue;
    /**
     * Constructor.
     * @param comparer - Comparer to use.
     * @param storedValue - Stored value to use as the value to always compare the input of `compareTo` to.
     */
    constructor(comparer: Comparer<T>, storedValue: T);
    /** @inheritdoc */
    compareTo(value: T): number;
}

/**
 * Compares two strings by en-us-u-kf-upper locale.
 */
export declare class LocaleStringComparer implements Comparer<string> {
    /** Static instance for reuse. */
    static readonly instance: LocaleStringComparer;
    /** @inheritdoc */
    compareTo(a: string, b: string): 1 | -1 | 0;
}

/**
 * Compares two values based on one of their properties.
 */
export declare class PropertyComparer<TValue, TProperty> implements Comparer<TValue> {
    private readonly getProperty;
    private readonly comparer;
    /**
     * Constructor.
     * @param getProperty - Gets the property from the value to use for comparisons.
     * @param comparer - Comparer to compare the properties with.
     */
    constructor(getProperty: (value: TValue) => TProperty, comparer: Comparer<TProperty>);
    /** @inheritdoc */
    compareTo(a: TValue, b: TValue): number;
}

/**
 * A stored comparer that compares a property to a stored value.
 */
export declare class PropertyStoredComparer<TValue, TProperty> implements StoredComparer<TValue> {
    private readonly getProperty;
    private readonly comparer;
    /**
     * Constructor.
     * @param getProperty - Gets the property from the value.
     * @param comparer - Comparer to compare the property with.
     */
    constructor(getProperty: (value: TValue) => TProperty, comparer: StoredComparer<TProperty>);
    /** @inheritdoc */
    compareTo(value: TValue): number;
}

/**
 * Compares a value against a stored value.
 */
export interface StoredComparer<T> {
    /**
     * Checks the value against a stored value returning -1 if the stored value preceeds, 0 if the value is equal, and 1 if follows.
     * @param value - Value to compare.
     */
    compareTo(value: T): number;
}

/** Decorator for memoizing the result of a method or get accessor. */
export declare function Memoize(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>): void;

/** Collection of helper functions that can be used to throw errors. */
export declare namespace errors {
    /** Base error class. */
    abstract class BaseError extends Error {
        readonly message: string;
        protected constructor();
    }
    /** Thrown when there is a problem with a provided argument. */
    class ArgumentError extends BaseError {
        constructor(argName: string, message: string);
    }
    /** Thrown when an argument is null or whitespace. */
    class ArgumentNullOrWhitespaceError extends ArgumentError {
        constructor(argName: string);
    }
    /** Thrown when an argument is out of range. */
    class ArgumentOutOfRangeError extends ArgumentError {
        constructor(argName: string, value: number, range: [number, number]);
    }
    /** Thrown when an argument does not match an expected type. */
    class ArgumentTypeError extends ArgumentError {
        constructor(argName: string, expectedType: string, actualType: string);
    }
    /** Thrown when a file or directory path was not found. */
    class PathNotFoundError extends BaseError {
        readonly path: string;
        constructor(path: string, prefix?: string);
        readonly code: "ENOENT";
    }
    /** Thrown when a directory was not found. */
    class DirectoryNotFoundError extends PathNotFoundError {
        constructor(dirPath: string);
    }
    /** Thrown when a file was not found. */
    class FileNotFoundError extends PathNotFoundError {
        constructor(filePath: string);
    }
    /** Thrown when an action was taken that is not allowed. */
    class InvalidOperationError extends BaseError {
        constructor(message: string);
    }
    /** Thrown when a certain behaviour or feature has not been implemented. */
    class NotImplementedError extends BaseError {
        constructor(message?: string);
    }
    /** Thrown when an operation is not supported. */
    class NotSupportedError extends BaseError {
        constructor(message: string);
    }
    /**
     * Thows if not a type.
     * @param value - Value to check the type of.
     * @param expectedType - Expected type.
     * @param argName - Argument name.
     */
    function throwIfNotType(value: any, expectedType: string, argName: string): void;
    /**
     * Throws if the value is not a string.
     * @param value - Value to check.
     * @param argName - Arg name.
     */
    function throwIfNotString(value: string, argName: string): void;
    /**
     * Throws if the value is not a string or is whitespace.
     * @param value - Value to check.
     * @param argName - Arg name.
     */
    function throwIfWhitespaceOrNotString(value: string, argName: string): void;
    /**
     * Throws an ArgumentOutOfRangeError if an argument's value is out of an inclusive range.
     * @param value - Value.
     * @param range - Range.
     * @param argName - Argument name.
     */
    function throwIfOutOfRange(value: number, range: [number, number], argName: string): void;
    /**
     * Throws an ArgumentOutOfRangeError if an argument's range value is out of an inclusive range.
     *
     * Also throws when the start of the range is greater than the end.
     * @param actualRange - Range to check.
     * @param range - Range to check against.
     * @param argName - Argument name.
     */
    function throwIfRangeOutOfRange(actualRange: [number, number], range: [number, number], argName: string): void;
    /**
     * Gets an error saying that a feature is not implemented for a certain syntax kind.
     * @param kind - Syntax kind that isn't implemented.
     */
    function throwNotImplementedForSyntaxKindError(kind: ts.SyntaxKind): never;
    /**
     * Throws an Argument
     * @param value
     * @param argName
     */
    function throwIfNegative(value: number, argName: string): void;
    /**
     * Throws when the value is null or undefined.
     * @param value - Value to check.
     * @param errorMessage - Error message to throw when not defined.
     */
    function throwIfNullOrUndefined<T>(value: T | undefined, errorMessage: string | (() => string)): T;
    /**
     * Throw if the value should have been the never type.
     * @param value - Value to check.
     */
    function throwNotImplementedForNeverValueError(value: never): never;
    /**
     * Throws an error if the actual value does not equal the expected value.
     * @param actual - Actual value.
     * @param expected - Expected value.
     * @param description - Message to show in the error. Should be a full sentence that doesn't include the actual and expected values.
     */
    function throwIfNotEqual<T>(actual: T, expected: T, description: string): void;
    /**
     * Throws if true.
     * @param value - Value to check.
     * @param errorMessage - Error message to throw when true.
     */
    function throwIfTrue(value: boolean | undefined, errorMessage: string): void;
}

/** An implementation of a file host that interacts with the actual file system. */
export declare class RealFileSystemHost implements FileSystemHost {
    private fs;
    private fastGlob;
    /** @inheritdoc */
    delete(path: string): Promise<void>;
    /** @inheritdoc */
    deleteSync(path: string): void;
    /** @inheritdoc */
    readDirSync(dirPath: string): string[];
    /** @inheritdoc */
    readFile(filePath: string, encoding?: string): Promise<string>;
    /** @inheritdoc */
    readFileSync(filePath: string, encoding?: string): string;
    /** @inheritdoc */
    writeFile(filePath: string, fileText: string): Promise<void>;
    /** @inheritdoc */
    writeFileSync(filePath: string, fileText: string): void;
    /** @inheritdoc */
    mkdir(dirPath: string): Promise<void>;
    /** @inheritdoc */
    mkdirSync(dirPath: string): void;
    /** @inheritdoc */
    move(srcPath: string, destPath: string): Promise<void>;
    /** @inheritdoc */
    moveSync(srcPath: string, destPath: string): void;
    /** @inheritdoc */
    copy(srcPath: string, destPath: string): Promise<void>;
    /** @inheritdoc */
    copySync(srcPath: string, destPath: string): void;
    /** @inheritdoc */
    fileExists(filePath: string): Promise<boolean>;
    /** @inheritdoc */
    fileExistsSync(filePath: string): boolean;
    /** @inheritdoc */
    directoryExists(dirPath: string): Promise<boolean>;
    /** @inheritdoc */
    directoryExistsSync(dirPath: string): boolean;
    /** @inheritdoc */
    realpathSync(path: string): string;
    /** @inheritdoc */
    getCurrentDirectory(): string;
    /** @inheritdoc */
    glob(patterns: ReadonlyArray<string>): Promise<string[]>;
    /** @inheritdoc */
    globSync(patterns: ReadonlyArray<string>): string[];
    /** @inheritdoc */
    isCaseSensitive(): boolean;
    private getDirectoryNotFoundErrorIfNecessary;
    private getFileNotFoundErrorIfNecessary;
}

/**
 * Represents a file system that can be interacted with.
 */
export interface FileSystemHost {
    /** Gets if this file system is case sensitive. */
    isCaseSensitive(): boolean;
    /** Asynchronously deletes the specified file or directory. */
    delete(path: string): Promise<void>;
    /** Synchronously deletes the specified file or directory */
    deleteSync(path: string): void;
    /**
     * Reads all the child directories and files.
     * @remarks Implementers should have this return the full file path.
     */
    readDirSync(dirPath: string): string[];
    /** Asynchronously reads a file at the specified path. */
    readFile(filePath: string, encoding?: string): Promise<string>;
    /** Synchronously reads a file at the specified path. */
    readFileSync(filePath: string, encoding?: string): string;
    /** Asynchronously writes a file to the file system. */
    writeFile(filePath: string, fileText: string): Promise<void>;
    /** Synchronously writes a file to the file system. */
    writeFileSync(filePath: string, fileText: string): void;
    /** Asynchronously creates a directory at the specified path. */
    mkdir(dirPath: string): Promise<void>;
    /** Synchronously creates a directory at the specified path. */
    mkdirSync(dirPath: string): void;
    /** Asynchronously moves a file or directory. */
    move(srcPath: string, destPath: string): Promise<void>;
    /** Synchronously moves a file or directory. */
    moveSync(srcPath: string, destPath: string): void;
    /** Asynchronously copies a file or directory. */
    copy(srcPath: string, destPath: string): Promise<void>;
    /** Synchronously copies a file or directory. */
    copySync(srcPath: string, destPath: string): void;
    /** Asynchronously checks if a file exists. */
    fileExists(filePath: string): Promise<boolean>;
    /** Synchronously checks if a file exists. */
    fileExistsSync(filePath: string): boolean;
    /** Asynchronously checks if a directory exists. */
    directoryExists(dirPath: string): Promise<boolean>;
    /** Synchronously checks if a directory exists. */
    directoryExistsSync(dirPath: string): boolean;
    /** See https://nodejs.org/api/fs.html#fs_fs_realpathsync_path_options */
    realpathSync(path: string): string;
    /** Gets the current directory of the environment. */
    getCurrentDirectory(): string;
    /** Uses pattern matching to find files or directories. */
    glob(patterns: ReadonlyArray<string>): Promise<string[]>;
    /** Synchronously uses pattern matching to find files or directories. */
    globSync(patterns: ReadonlyArray<string>): string[];
}

/**
 * FileSystemHost wrapper that allows transactionally queuing operations to the file system.
 */
export declare class TransactionalFileSystem {
    private readonly fileSystem;
    private readonly directories;
    private readonly pathCasingMaintainer;
    /**
     * Constructor.
     * @param fileSystem - File system host to commit the operations to.
     */
    constructor(fileSystem: FileSystemHost);
    queueFileDelete(filePath: string): void;
    removeFileDelete(filePath: string): void;
    queueMkdir(dirPath: string): void;
    queueDirectoryDelete(dirPath: string): void;
    queueMoveDirectory(srcPath: string, destPath: string): void;
    queueCopyDirectory(srcPath: string, destPath: string): void;
    flush(): Promise<void>;
    flushSync(): void;
    saveForDirectory(dirPath: string): Promise<void>;
    saveForDirectorySync(dirPath: string): void;
    private getAndClearOperationsForDir;
    private executeOperation;
    private executeOperationSync;
    private getAndClearOperations;
    moveFileImmediately(oldFilePath: string, newFilePath: string, fileText: string): Promise<void>;
    moveFileImmediatelySync(oldFilePath: string, newFilePath: string, fileText: string): void;
    deleteFileImmediately(filePath: string): Promise<void>;
    deleteFileImmediatelySync(filePath: string): void;
    copyDirectoryImmediately(srcDirPath: string, destDirPath: string): Promise<void>;
    copyDirectoryImmediatelySync(srcDirPath: string, destDirPath: string): void;
    moveDirectoryImmediately(srcDirPath: string, destDirPath: string): Promise<void>;
    moveDirectoryImmediatelySync(srcDirPath: string, destDirPath: string): void;
    deleteDirectoryImmediately(dirPath: string): Promise<void>;
    deleteDirectoryImmediatelySync(dirPath: string): void;
    private deleteSuppressNotFound;
    private deleteSuppressNotFoundSync;
    fileExistsSync(filePath: string): boolean;
    directoryExistsSync(dirPath: string): boolean;
    readFileSync(filePath: string, encoding: string | undefined): string;
    readDirSync(dirPath: string): string[];
    glob(patterns: ReadonlyArray<string>): Promise<string[]>;
    globSync(patterns: ReadonlyArray<string>): string[];
    getFileSystem(): FileSystemHost;
    getCurrentDirectory(): string;
    getDirectories(dirPath: string): string[];
    realpathSync(path: string): string;
    getStandardizedAbsolutePath(fileOrDirPath: string, relativeBase?: string): string;
    readFileOrNotExists(filePath: string, encoding: string): false | Promise<string | false>;
    readFileOrNotExistsSync(filePath: string, encoding: string): string | false;
    writeFile(filePath: string, fileText: string): Promise<void>;
    writeFileSync(filePath: string, fileText: string): void;
    private isPathDirectoryInQueueThatExists;
    private isPathQueuedForDeletion;
    private removeDirAndSubDirs;
    private addBackDirAndSubDirs;
    private operationIndex;
    private getNextOperationIndex;
    private getParentDirectoryIfExists;
    private getOrCreateParentDirectory;
    private getDirectoryIfExists;
    private getOrCreateDirectory;
    private throwIfHasExternalOperations;
    private ensureDirectoryExists;
    private ensureDirectoryExistsSync;
    private removeMkDirOperationsForDir;
}

/** Utilities for working with files. */
export declare class FileUtils {
    static readonly ENOENT = "ENOENT";
    private constructor();
    /**
     * Gets if the error is a file not found or directory not found error.
     * @param err - Error to check.
     */
    static isNotExistsError(err: any): boolean;
    /**
     * Joins the paths.
     * @param paths - Paths to join.
     */
    static pathJoin(...paths: string[]): string;
    /**
     * Gets if the path is absolute.
     * @param fileOrDirPath - File or directory path.
     */
    static pathIsAbsolute(fileOrDirPath: string): boolean;
    /**
     * Gets the standardized absolute path.
     * @param fileSystem - File system.
     * @param fileOrDirPath - Path to standardize.
     * @param relativeBase - Base path to be relative from.
     */
    static getStandardizedAbsolutePath(fileSystem: FileSystemHost, fileOrDirPath: string, relativeBase?: string): string;
    /**
     * Gets the directory path.
     * @param fileOrDirPath - Path to get the directory name from.
     */
    static getDirPath(fileOrDirPath: string): string;
    /**
     * Gets the base name.
     * @param fileOrDirPath - Path to get the base name from.
     */
    static getBaseName(fileOrDirPath: string): string;
    /**
     * Gets the extension of the file name.
     * @param fileOrDirPath - Path to get the extension from.
     */
    static getExtension(fileOrDirPath: string): string;
    /**
     * Changes all back slashes to forward slashes.
     * @param fileOrDirPath - Path.
     */
    static standardizeSlashes(fileOrDirPath: string): string;
    /**
     * Checks if a path ends with a specified search path.
     * @param fileOrDirPath - Path.
     * @param endsWithPath - Ends with path.
     */
    static pathEndsWith(fileOrDirPath: string | undefined, endsWithPath: string | undefined): boolean;
    /**
     * Checks if a path starts with a specified search path.
     * @param fileOrDirPath - Path.
     * @param startsWithPath - Starts with path.
     */
    static pathStartsWith(fileOrDirPath: string | undefined, startsWithPath: string | undefined): boolean;
    private static splitPathBySlashes;
    /**
     * Gets the parent most paths out of the list of paths.
     * @param paths - File or directory paths.
     */
    static getParentMostPaths(paths: string[]): string[];
    /**
     * Reads a file or returns false if the file doesn't exist.
     * @param fileSystem - File System.
     * @param filePath - Path to file.
     * @param encoding - File encoding.
     */
    static readFileOrNotExists(fileSystem: FileSystemHost, filePath: string, encoding: string): Promise<string | false>;
    /**
     * Reads a file synchronously or returns false if the file doesn't exist.
     * @param fileSystem - File System.
     * @param filePath - Path to file.
     * @param encoding - File encoding.
     */
    static readFileOrNotExistsSync(fileSystem: FileSystemHost, filePath: string, encoding: string): string | false;
    /**
     * Gets the text with a byte order mark.
     * @param text - Text.
     */
    static getTextWithByteOrderMark(text: string): string;
    /**
     * Gets the relative path from one absolute path to another.
     * @param absoluteDirPathFrom - Absolute directory path from.
     * @param absolutePathTo - Absolute path to.
     */
    static getRelativePathTo(absoluteDirPathFrom: string, absolutePathTo: string): string;
    /**
     * Gets if the path is for the root directory.
     * @param path - Path.
     */
    static isRootDirPath(dirOrFilePath: string): boolean;
    /**
     * Gets the descendant directories of the specified directory.
     * @param dirPath - Directory path.
     */
    static getDescendantDirectories(fileSystemWrapper: TransactionalFileSystem, dirPath: string): IterableIterator<string>;
    /**
     * Gets the glob as absolute.
     * @param glob - Glob.
     * @param cwd - Current working directory.
     */
    static toAbsoluteGlob(glob: string, cwd: string): string;
    /**
     * Gets if the glob is a negated glob.
     * @param glob - Glob.
     */
    static isNegatedGlob(glob: string): boolean;
}

/** Checks the specified file paths to see if the match any of the specified patterns. */
export declare function matchGlobs(paths: ReadonlyArray<string>, patterns: ReadonlyArray<string> | string, cwd: string): string[];

/** An implementation of a file system that exists in memory only. */
export declare class InMemoryFileSystemHost implements FileSystemHost {
    private readonly directories;
    constructor();
    /** @inheritdoc */
    isCaseSensitive(): boolean;
    /** @inheritdoc */
    delete(path: string): Promise<void>;
    /** @inheritdoc */
    deleteSync(path: string): void;
    /** @inheritdoc */
    readDirSync(dirPath: string): string[];
    /** @inheritdoc */
    readFile(filePath: string, encoding?: string): Promise<string>;
    /** @inheritdoc */
    readFileSync(filePath: string, encoding?: string): string;
    /** @inheritdoc */
    writeFile(filePath: string, fileText: string): Promise<void>;
    /** @inheritdoc */
    writeFileSync(filePath: string, fileText: string): void;
    /** @inheritdoc */
    mkdir(dirPath: string): Promise<void>;
    /** @inheritdoc */
    mkdirSync(dirPath: string): void;
    /** @inheritdoc */
    move(srcPath: string, destPath: string): Promise<void>;
    /** @inheritdoc */
    moveSync(srcPath: string, destPath: string): void;
    /** @inheritdoc */
    copy(srcPath: string, destPath: string): Promise<void>;
    /** @inheritdoc */
    copySync(srcPath: string, destPath: string): void;
    private _copyDirInternal;
    /** @inheritdoc */
    fileExists(filePath: string): Promise<boolean>;
    /** @inheritdoc */
    fileExistsSync(filePath: string): boolean;
    /** @inheritdoc */
    directoryExists(dirPath: string): Promise<boolean>;
    /** @inheritdoc */
    directoryExistsSync(dirPath: string): boolean;
    /** @inheritdoc */
    realpathSync(path: string): string;
    /** @inheritdoc */
    getCurrentDirectory(): string;
    /** @inheritdoc */
    glob(patterns: ReadonlyArray<string>): Promise<string[]>;
    /** @inheritdoc */
    globSync(patterns: ReadonlyArray<string>): string[];
    private getOrCreateDir;
}

/**
 * Gets the enum name for the specified syntax kind.
 * @param kind - Syntax kind.
 */
export declare function getSyntaxKindName(kind: ts.SyntaxKind): string;

/**
 * Holds the compiler options.
 */
export declare class CompilerOptionsContainer extends SettingsContainer<ts.CompilerOptions> {
    constructor();
    /**
     * Sets one or all of the compiler options.
     *
     * WARNING: Setting the compiler options will cause a complete reparse of all the source files.
     * @param settings - Compiler options to set.
     */
    set(settings: Partial<ts.CompilerOptions>): void;
    /**
     * Gets the encoding from the compiler options or returns utf-8.
     */
    getEncoding(): string;
}

export declare abstract class SettingsContainer<T extends object> {
    protected _settings: T;
    /**
     * Constructor.
     * @param defaultSettings - The settings to use by default.
     */
    constructor(defaultSettings: T);
    /**
     * Resets the settings to the default.
     */
    reset(): void;
    /**
     * Gets a copy of the settings as an object.
     */
    get(): T;
    /**
     * Sets one or all of the settings.
     * @param settings - Settings to set.
     */
    set(settings: Partial<T>): void;
    /**
     * Subscribe to modifications in the settings container.
     * @param action - Action to execute when the settings change.
     */
    onModified(action: () => void): void;
}

export declare function matchFiles(this: any, path: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string>, includes: ReadonlyArray<string>, useCaseSensitiveFileNames: boolean, currentDirectory: string, depth: number | undefined, getEntries: (path: string) => FileSystemEntries, realpath: (path: string) => string): string[];

export declare function getFileMatcherPatterns(this: any, path: string, excludes: ReadonlyArray<string>, includes: ReadonlyArray<string>, useCaseSensitiveFileNames: boolean, currentDirectory: string): FileMatcherPatterns;

export declare function getEmitModuleResolutionKind(this: any, compilerOptions: ts.CompilerOptions): any;

export interface FileMatcherPatterns {
    /** One pattern for each "include" spec. */
    includeFilePatterns: ReadonlyArray<string>;
    /** One pattern matching one of any of the "include" specs. */
    includeFilePattern: string;
    includeDirectoryPattern: string;
    excludePattern: string;
    basePaths: ReadonlyArray<string>;
}

export interface FileSystemEntries {
    readonly files: ReadonlyArray<string>;
    readonly directories: ReadonlyArray<string>;
}

export declare class ArrayUtils {
    private constructor();
    static isReadonlyArray<T>(a: unknown): a is ReadonlyArray<T>;
    static isNullOrEmpty<T>(a: (ReadonlyArray<T> | undefined)): a is undefined;
    static getUniqueItems<T>(a: ReadonlyArray<T>): T[];
    static removeFirst<T>(a: T[], item: T): boolean;
    static removeAll<T>(a: T[], isMatch: (item: T) => boolean): T[];
    static flatten<T>(items: T[][]): T[];
    static from<T>(items: ts.Iterator<T>): T[];
    static toIterator<T>(items: ReadonlyArray<T>): Generator<T, void, unknown>;
    static sortByProperty<T>(items: T[], getProp: (item: T) => string | number): T[];
    static groupBy<T>(items: ReadonlyArray<T>, getGroup: (item: T) => string | number): T[][];
    static binaryInsertWithOverwrite<T>(items: T[], newItem: T, comparer: Comparer<T>): void;
    static binarySearch<T>(items: ReadonlyArray<T>, storedComparer: StoredComparer<T>): number;
    static containsSubArray<T>(items: ReadonlyArray<T>, subArray: ReadonlyArray<T>): boolean;
}

/**
 * Event container subscription type
 */
export declare type EventContainerSubscription<EventArgType> = (arg: EventArgType) => void;

/**
 * Event container for event subscriptions.
 */
export declare class EventContainer<EventArgType = undefined> {
    private readonly subscriptions;
    /**
     * Subscribe to an event being fired.
     * @param subscription - Subscription.
     */
    subscribe(subscription: EventContainerSubscription<EventArgType>): void;
    /**
     * Unsubscribe to an event being fired.
     * @param subscription - Subscription.
     */
    unsubscribe(subscription: EventContainerSubscription<EventArgType>): void;
    /**
     * Fire an event.
     */
    fire(arg: EventArgType): void;
    private getIndex;
}

export declare class IterableUtils {
    static find<T>(items: IterableIterator<T>, condition: (item: T) => boolean): T | undefined;
}

export declare class ObjectUtils {
    private constructor();
    static clone<T>(obj: T): T;
    static assign<T, U>(a: T, b: U): T & U;
    static assign<T, U, V>(a: T, b: U, c: V): T & U & V;
    private static es5Assign;
}

export declare class StringUtils {
    private constructor();
    static isWhitespaceChar(char: string | undefined): boolean;
    static isSpaces(text: string): boolean;
    static hasBom(text: string): boolean;
    static stripBom(text: string): string;
    static isNullOrWhitespace(str: string | undefined): str is undefined;
    static isNullOrEmpty(str: string | undefined): str is undefined;
    static isWhitespace(text: string | undefined): boolean;
    static startsWithNewLine(str: string | undefined): boolean;
    static endsWithNewLine(str: string | undefined): boolean;
    static insertAtLastNonWhitespace(str: string, insertText: string): string;
    static getLineNumberAtPos(str: string, pos: number): number;
    static getLengthFromLineStartAtPos(str: string, pos: number): number;
    static getLineStartFromPos(str: string, pos: number): number;
    static getLineEndFromPos(str: string, pos: number): number;
    static escapeForWithinString(str: string, quoteKind: "\"" | "'"): string;
    /**
     * Escapes all the occurrences of the char in the string.
     */
    static escapeChar(str: string, char: string): string;
    static removeIndentation(str: string, opts: {
        isInStringAtPos: (pos: number) => boolean;
        indentSizeInSpaces: number;
    }): string;
    static indent(str: string, times: number, options: {
        indentText: string;
        indentSizeInSpaces: number;
        isInStringAtPos: (pos: number) => boolean;
    }): string;
}

export declare function getLibFiles(): {
    fileName: string;
    text: string;
}[];

import { SyntaxKind, ScriptTarget, ScriptKind, LanguageVariant, EmitHint, ModuleKind, ModuleResolutionKind, NewLineKind, TypeFlags, ObjectFlags, SymbolFlags, TypeFormatFlags, DiagnosticCategory, CompilerOptions, EditorSettings } from "typescript";
export { ts, SyntaxKind, ScriptTarget, ScriptKind, LanguageVariant, EmitHint, ModuleKind, ModuleResolutionKind, NewLineKind, TypeFlags, ObjectFlags, SymbolFlags, TypeFormatFlags, DiagnosticCategory, CompilerOptions, EditorSettings };