import {F, InterruptorAgent} from "../common/InterruptorAgent";
import {InterruptorGenericException} from "../common/InterruptorException";
import {T,L} from "../common/Types";
import * as DEF from "./LinuxArm64Flags";
import {TypedData} from "../common/TypedData";

// GPR = Global Purpose Register prefix => x/r
const GPR = "x";
const SVC_NUM = 0;
const SVC_NAME = 1;
const SVC_ARG = 3;
const SVC_RET = 4;
const SVC_ERR = 5;

//{AT_, E, MAP_, X}
const AT_ = DEF.AT_;
const E = DEF.E;
const MAP_ = DEF.MAP_;
const X = DEF.X;
const _ = TypedData.from;

export const DSTRUCTS = {};

// internal structs are always parsed
export const IDSTRUCTS = {};

// arguments template
const A = {
    DFD: _({t: T.INT32, n:"dfd", l:L.DFD}),
    OLD_DFD: _({t: T.INT32, n:"old_dfd", l:L.DFD}),
    NEW_DFD: _({t: T.INT32, n:"new_dfd", l:L.DFD}),
    FD: _({t:T.UINT32, n:"fd", l:L.FD}),
    FD_SET: _({t:T.POINTER64, n:"fd_set*", l:L.BUFFER, f:"FD" }),
    SOCKFD: _({t:T.UINT32, n:"sockfd", l:L.SOCKFD}),
    EPFD: _({t:T.UINT32, n:"epfd", l:L.EPFD}),
    AIO: _({t:T.ULONG, n:"aio_context_t ctx_id"}),
    LFD: _({t:T.ULONG, n:"fd", l:L.FD}),
    CONST_PATH: _({t:T.STRING, n:"path", l:L.PATH, c:true}),
    CONST_NAME: _({t:T.STRING, n:"name", c:true}),
    STR: _({t:T.STRING, n:"char*"}),
    OLD_NAME: _({t:T.CHAR_BUFFER, n:"old_name", c:true}),
    NEW_NAME: _({t:T.CHAR_BUFFER, n:"new_name", c:true}),
    CONST_FNAME: _({t:T.STRING, n:"filename", c:true}),
    SIZE: _({t:T.UINT32, n:"size", l:L.SIZE}),
    LEN: _({t:T.ULONG, n:"length", l:L.SIZE}),
    OFFSET: _({t:T.UINT32, n:"offset", l:L.SIZE}),
    LOFFSET: _({t:T.ULONG, n:"offset", l:L.SIZE}),
    SIGNED_LEN: _({t:T.LONG, n:"length", l:L.SIZE}),
    XATTR: _({t:T.INT32, n:"flags", l:L.FLAG, f:X.XATTR }),
    XATTR_LIST: _({t:T.CHAR_BUFFER, n:"list", l:L.XATTR_LIST, r:2}),
    PID: _({t:T.INT32, n:"pid", l:L.PID }),
    SCHED_POLICY: _({t:T.UINT32, n:"policy", l:L.FLAG, f:X.SCHED}),
    UID: _({t:T.UINT32, n:"user", l:L.UID }),
    GID: _({t:T.UINT32, n:"group", l:L.GID }),
    SIG: _({t:T.INT32, n:"sig", l:L.FLAG, f:X.SIG   }),
    TID: _({t:T.INT32, n:"thread" }),
    CALLER_TID: _({t:T.INT32, n:"caller_tid" }),
    PTR: _({t:T.POINTER64, n:"value"}),
    START_ADDR: _({t:T.POINTER64, n:"start_addr", l:L.VADDR, f:X.RANGE}),
    ADDR: _({t:T.POINTER64, n:"addr", l:L.VADDR, f:X.RANGE}),
    CONST_PTR: _({t:T.POINTER64, n:"value", c:true}),
    MPROT: _({t:T.INT32, n:"prot", l:L.FLAG, f:X.MPROT}),
    FMODE: _({t:T.INT32, n:"mode", l:L.FLAG, f:X.F_MODE}),
    CLKID: _({t:T.INT32, n:"clockid", l:L.FLAG, f:X.CLK}),
    WD: _({t:T.INT32, n:"wd", l:L.WD}),
    EPEV: _({t:T.POINTER64, n:"struct epoll_event *event", l:L.FLAG, f:X.EPOLL_EV}),
    OUTPUT_CHAR_BUFFER: _({t:T.POINTER64, n:"buf", l:L.OUTPUT_BUFFER}),
    OUTPUT_BUFFER_LEN: _({t:T.INT32, n:"size", l:L.SIZE}),
    IOPRIO_WHICH: _({ t:T.INT32, n:"which", l:L.FLAG, r:"x1", f:X.IOPRIO_WHICH }),
    IOVEC: _({t:T.POINTER64, n:"*iovec", l:L.DSTRUCT, f:"iovec", c:true}),
    KERNEL_TIMESPEC: _({t:T.POINTER64, n:"*__kernel_timespec", l:L.DSTRUCT, f:"__kernel_timespec"} ),
    CONST_KERNEL_TIMESPEC: _({t:T.POINTER64, n:"*__kernel_timespec", l:L.DSTRUCT, f:"__kernel_timespec", c:true} ),
    ACCESS_FLAGS: _({t:T.INT32, n:"flag", l:L.FLAG, f:X.ACCESS_FLAGS}),
    PKEY: _({ t:T.INT32, n:"pkey", l:L.PKEY}),
    RWF: _({t:T.INT32, n:"rwf", l:L.FLAG, f:X.RWF}),
    SIGMASK: _({t:T.POINTER64, n:"sigmask", l:L.BUFFER}),
    TIMER: _({ t:T.INT32, n:"which", l:L.FLAG, f:X.TIMER}),
    TIMER_PTR: _({ t:T.POINTER64, n:"timer_id*", l:L.TIMER}),
    PERSO: _({ t:T.UINT32, n:"personna", l:L.FLAG, f:X.PERSO}),
    RES: _({ t:T.UINT32, n:"resource", l:L.FLAG, f:X.RES}),
    OFLAGS: _({t:T.UINT32, n:"flags", l:L.FLAG, f:X.O_MODE}),
    OMODE: _({t:T.UINT32, n:"mode", l:L.FLAG, f:X.UMASK}),
    MQD: _({ t:T.INT32, n:"mod_t mqdes", l:L.MQDES}),
    MQID: _({ t:T.INT32, n:"msqid" }),
    SEMID: _({ t:T.INT32, n:"semid" }),
    IOCB: _({t:T.POINTER64, n:"*iocb", l:L.DSTRUCT, f:"iocb"} ),
    IOEV: _({t:T.POINTER64, n:"*io_event", l:L.DSTRUCT, f:"io_event"} ),
    SCHED_PARAM: _({t:T.POINTER64, n:"*sched_param", l:L.DSTRUCT, f:"sched_param"})

}
A.SIGMASK.update({ f:A.SIG, len:16 });

const RET:any = {
    INFO: {t:T.INT32, e:[E.EAGAIN,E.EINVAL,E.EPERM]},
    ACCESS: {t:T.INT32, e:[E.EACCES, E.EFAULT, E.EINVAL, E.ELOOP, E.ENAMETOOLONG, E.ENOENT, E.ENOMEM, E.ENOTDIR, E.EOVERFLOW, E.EIO, E.ETXTBSY, E.EROFS]},
    STAT: {t:T.INT32, e:[E.EACCES, E.EBADF, E.EFAULT, E.EINVAL, E.ELOOP, E.ENAMETOOLONG, E.ENOENT, E.ENOMEM, E.ENOTDIR, E.EOVERFLOW]},
    LINK: {t:T.INT32, e:[E.EACCES,E.EEXIST, E.EFAULT, E.EIO, E.ELOOP, E.EMLINK, E.ENAMETOOLONG, E.ENOENT, E.ENOMEM, E.ENOSPC,E.ENOTDIR, E.EPERM,E.EROFS,E.EXDEV] },
    OPEN: {t:T.INT32, e:[E.EACCES,E.EEXIST, E.EFAULT, E.ENODEV, E.ENOENT, E.ENOMEM, E.ENOSPC, E.ENOTDIR, E.ENXIO, E.EPERM, E.EROFS, E.ETXTBSY,  E.EFBIG, E.EINTR, E.EISDIR, E.ELOOP, E.ENAMETOOLONG, E.EMFILE,E.ENFILE,E.ENOMEM]},
}

RET.VADDR = {t:T.INT32, n:'addr', l:L.VADDR, e:[ E.EACCES, E.EAGAIN, E.EBADF, E.EINVAL, E.ENFILE, E.ENODEV, E.ENOMEM, E.ETXTBSY]};
RET.SET_XATTR = {t:T.INT32, e:RET.STAT.e.concat([E.EDQUOT, E.EEXIST, E.ENODATA, E.ENOSPC, E.ENOTSUP, E.EPERM, E.ERANGE]) };
RET.GET_XATTR = {t:T.INT32, e:RET.STAT.e.concat([E.E2BIG, E.ENODATA, E.ENOTSUP, E.ERANGE]) };
RET.LS_XATTR = {t:T.INT32, e:RET.STAT.e.concat([E.E2BIG, E.ENOTSUP, E.ERANGE]) };
RET.RM_XATTR = {t:T.INT32, e:RET.STAT.e.concat([E.ENOTSUP, E.ERANGE]) };
RET.OPENAT = {t:T.INT32, n:'FD', l:L.FD, r:1, e:RET.OPEN.e.concat([E.EBADF, E.ENOTDIR]) };
RET.LINKAT = {t:T.INT32, e:RET.LINK.e.concat([E.EBADF, E.ENOTDIR]) };
RET.IO = {t:T.INT32, e:RET.INFO.e.concat([E.EBADF, E.EFAULT, E.ENOSYS]) };


const SVC = [
    [0,"io_setup",0x00,[{t:T.UINT32, n:"nr_reqs"},{t:T.POINTER64, n:"aio_context_t *ctx"}]],
    [1,"io_destroy",0x01,[A.AIO],RET.IO],
    [2,"io_submit",0x02,[A.AIO,{t:T.LONG, n:"nr"},{t:T.POINTER64, n:"struct iocb **iocbpp"}],RET.IO],
    [3,"io_cancel",0x03,[A.AIO,A.IOCB,A.IOEV.copy("result")],RET.IO],
    [4,"io_getevents",0x04,[A.AIO,{t:T.LONG, n:"long min_nr"},{t:T.LONG, n:"nr"},A.IOEV.copy("*events"),A.KERNEL_TIMESPEC.copy("timeout") ],RET.IO],
    [5,"setxattr",0x05,[A.CONST_PATH,A.CONST_NAME,A.PTR,A.SIZE,A.XATTR],RET.SET_XATTR],
    [6,"lsetxattr",0x06,[A.CONST_PATH,A.CONST_NAME,A.PTR,A.SIZE,A.XATTR],RET.SET_XATTR],
    [7,"fsetxattr",0x07,[A.FD,A.CONST_NAME,A.CONST_PTR,A.SIZE,A.XATTR],RET.SET_XATTR],
    [8,"getxattr",0x08,[A.CONST_PATH,A.CONST_NAME,A.PTR,A.SIZE],RET.GET_XATTR],
    [9,"lgetxattr",0x09,[A.CONST_PATH,A.CONST_NAME,A.PTR,A.SIZE],RET.GET_XATTR],
    [10,"fgetxattr",0x0a,[A.FD,A.CONST_NAME,A.PTR,A.SIZE],RET.GET_XATTR],
    [11,"listxattr",0x0b,[A.CONST_PATH,A.XATTR_LIST,A.SIZE],RET.LS_XATTR],
    [12,"llistxattr",0x0c,[A.CONST_PATH,A.XATTR_LIST,A.SIZE],RET.LS_XATTR],
    [13,"flistxattr",0x0d,[ A.FD,A.XATTR_LIST,A.SIZE],RET.LS_XATTR],
    [14,"removexattr",0x0e,[A.CONST_PATH,A.CONST_NAME],RET.RM_XATTR],
    [15,"lremovexattr",0x0f,[A.CONST_PATH,A.CONST_NAME],RET.RM_XATTR],
    [16,"fremovexattr",0x10,[ A.FD,A.CONST_PATH,A.CONST_NAME],RET.RM_XATTR],
    [17,"getcwd",0x11,[{t:T.CHAR_BUFFER, n:"path_buff", l:L.PATH},A.SIZE],{t:T.CHAR_BUFFER, n:"path_buff", l:L.PATH, e:[E.EACCES,E.EFAULT,E.EINVAL,E.ENOENT,E.ERANGE]}],
    [18,"lookup_dcookie",0x12,[{t:T.ULONG, n:"cookie64"},{t:T.CHAR_BUFFER, n:"buffer", l:L.XATTR_LIST, r:2},A.SIZE]],
    [19,"eventfd2",0x13,[{t:T.UINT32, n:"count"} ,{t:T.INT32, n:"flags"}]],
    [20,"epoll_create1",0x14,[{t:T.INT32, n:"flags", l:L.FLAG, f:X.EPOLL_FLAG}]],
    [21,"epoll_ctl",0x15,[A.EPFD,{t:T.UINT32, n:"op", l:L.FLAG, f:X.EPOLL_CTL},A.FD,A.EPEV]],
    [22,"epoll_pwait",0x16,[A.EPFD,A.EPEV,{t:T.INT32, n:"maxevents"},{t:T.INT32, n:"timeout"},{t:T.POINTER64, n:"const sigset_t *sigmask", c:true }]],
    [23,"dup",0x17,[A.FD],{t:T.UINT32, n:"fd", l:L.FD, e:[E.EBADF, E.EBUSY, E.EINTR, E.EINVAL, E.EMFILE]}],
    [24,"dup3",0x18,[{t:T.UINT32, n:"old_fd", l:L.FD},{t:T.UINT32, n:"old_fd", l:L.FD}, {t:T.INT32, n:"flags", l:L.FLAG}],{t:T.UINT32, n:"fd", l:L.FD, e:[E.EBADF, E.EBUSY, E.EINTR, E.EINVAL, E.EMFILE]}],
    [25,"fcntl",0x19,[A.FD,{t:T.UINT32, n:"cmd", l:L.FLAG, f:X.FNCTL} ,{t:T.ULONG, n:"args", l:L.FLAG, r:"x1", f:X.FCNTL_ARGS}], {t:T.INT32, n:"ret", r:"x1", l:L.FLAG, f:X.FCNTL_RET}],
    [26,"inotify_init1",0x1a,[{t:T.INT32, n:"flags", l:L.FLAG, f:X.INOTIFY_FLAGS}],{t:T.INT32, e:[E.EMFILE,E.EINVAL,E.ENFILE,E.ENOMEM]}],
    [27,"inotify_add_watch",0x1b,[A.FD,A.CONST_PATH,{t:T.UINT32, n:"mask", l:L.FLAG, f:X.INOTIFY_MASK}],A.WD.asReturn([E.EACCES,E.EBADF,E.EEXIST,E.EFAULT,E.EINVAL,E.ENAMETOOLONG,E.ENOENT,E.ENOMEM,E.ENOSPC,E.ENOTDIR])],
    [28,"inotify_rm_watch",0x1c,[A.FD,A.WD],{t:T.INT32, e:[E.EBADF,E.EINVAL]}],
    [29,"ioctl",0x1d,[ A.FD,{t:T.UINT32, n:"cmd"},{t:T.ULONG, n:"arg"}]],
    [30,"ioprio_set",0x1e,[A.IOPRIO_WHICH,{t:T.INT32, n:"who"},{t:T.INT32, n:"ioprio"}]],
    [31,"ioprio_get",0x1f,[A.IOPRIO_WHICH,{t:T.INT32, n:"who"}]],
    [32,"flock",0x20,[A.FD,{t:T.UINT32, n:"ope", l:L.FLAG, f:X.FLOCK}]],
    [33,"mknodat",0x21,[ A.DFD,A.CONST_NAME,{t:T.INT32, n:"umode", l:L.FLAG, f:X.NODMODE, r:"x3" },{t:T.INT32, n:"dev", l:L.DEV }]],
    [34,"mkdirat",0x22,[A.DFD,A.CONST_FNAME,A.XATTR.copy("umode")]],
    [35,"unlinkat",0x23,[A.DFD,A.CONST_FNAME,{t:T.INT32, n:"flags", l:L.FLAG, f:X.UNLINK}]],
    [36,"symlinkat",0x24,[A.CONST_NAME.copy("oldname"),A.NEW_DFD,A.CONST_NAME.copy("newname")]],
    [37,"linkat",0x25,[A.OLD_DFD,{t:T.POINTER64, n:"value"},A.NEW_DFD,{t:T.POINTER64, n:"value"}, {t:T.UINT32, n:"flags", l:L.FLAG, f:X.LINKAT}],RET.LINKAT],
    [38,"renameat",0x26,[A.OLD_DFD,A.CONST_NAME.copy("oldname"),A.NEW_DFD,A.CONST_NAME.copy("newname")]],
    [39,"umount2",0x27,[A.CONST_PATH /* target */,{t:T.INT32, n:"flags", l:L.FLAG, f:X.UMOUNT, c:true}]],
    [40,"mount",0x28,[ A.STR.copy("dev_name"), A.STR.copy("dir_name"), A.STR.copy("type"),{t:T.ULONG, n:"flags", l:L.FLAG, f:X.MOUNT_FLAG},{t:T.POINTER64, n:"*dat"}]],
    [41,"pivot_root",0x29,[A.CONST_NAME.copy("new_root"),A.CONST_NAME.copy("put_old")]],
    [42,"nfsservctl",0x2a,["REMOVED int cmd", "struct nfsctl_arg *argp","union nfsctl_res *resp"]], // REMOVED since 3.1
    [43,"statfs",0x2b,[A.CONST_PATH,{t:T.POINTER64, n:"statfs *buf", l:L.DSTRUCT, f:"statfs"}]],
    [44,"fstatfs",0x2c,[A.FD,{t:T.POINTER64, n:"statfs *buf", l:L.DSTRUCT, f:"statfs"}]],
    [45,"truncate",0x2d,[A.CONST_PATH, A.SIGNED_LEN]],
    [46,"ftruncate",0x2e,[A.FD,A.LEN],RET.OPEN /* similar to open() */],
    [47,"fallocate",0x2f,[A.FD,{t:T.INT32, n:"mode", l:L.FLAG, f:X.FALLOC},A.LOFFSET,A.LEN]],
    [48,"faccessat",0x30,[A.DFD,A.CONST_FNAME,A.FMODE],RET.ACCESS],
    [49,"chdir",0x31,[{t:T.CHAR_BUFFER, n:"path", l:L.PATH, c:true}]],
    [50,"fchdir",0x32,[A.FD],{t:T.INT32, e:[E.EACCES,E.EFAULT,E.EIO,E.ELOOP,E.ENAMETOOLONG,E.ENOENT,E.ENOMEM,E.ENOTDIR,E.EPERM,E.EBADF]}],
    [51,"chroot",0x33,[{t:T.CHAR_BUFFER, n:"path", l:L.PATH, c:true}],{t:T.INT32, e:[E.EACCES,E.EFAULT,E.EIO,E.ELOOP,E.ENAMETOOLONG,E.ENOENT,E.ENOMEM,E.ENOTDIR,E.EPERM]}],
    [52,"fchmod",0x34,[A.FD,{t:T.USHORT, n:"mode", l:L.ATTRMODE, f:X.ATTR}],{t:T.INT32, e:[E.EACCES,E.EFAULT,E.EIO,E.ELOOP,E.ENAMETOOLONG,E.ENOENT,E.ENOMEM,E.ENOTDIR,E.EPERM,E.EBADF,E.EROFS]}],
    [53,"fchmodat",0x35,[A.DFD,A.CONST_PATH,A.FMODE]],
    [54,"fchownat",0x36,[A.DFD,A.CONST_PATH,A.UID,A.GID,A.ACCESS_FLAGS]],
    [55,"fchown",0x37,[A.FD,A.UID,A.GID]],
    [56,"openat",0x38,[A.DFD, A.CONST_FNAME,A.OFLAGS,A.OMODE],RET.OPENAT],
    [57,"close",0x39,[A.FD]],
    [58,"vhangup",0x3a,[]],
    [59,"pipe2",0x3b,[{t:T.POINTER64, n:"pipefd", l:L.PIPEFD},{t:T.INT32, n:"flags", l:L.FLAG, f:X.PIPE_FLAG}]],
    [60,"quotactl",0x3c,["unsigned int cmd",A.CONST_NAME.copy("special"),"qid_t id","void *addr"]],
    [61,"getdents64",0x3d,[{t:T.UINT32, n:"fd", l:L.FD},{t:T.POINTER64, n:"linux_dirent64 *dirent", l:L.DSTRUCT, f:"linux_dirent64"},A.SIZE]],
    [62,"lseek",0x3e,[A.FD,A.OFFSET,{t:T.UINT32, n:"whence", l:L.FLAG, f:X.SEEK}]],
    [63,"read",0x3f,[A.FD, A.OUTPUT_CHAR_BUFFER, {t:T.UINT32, n:"count", l:L.SIZE}], {t:T.UINT32, r:1, n:"sz", l:L.SIZE}],
    [64,"write",0x40,[A.FD,{t:T.CHAR_BUFFER, n:"buf", c:true},A.SIZE]],
    [65,"readv",0x41,[A.FD,A.IOVEC,A.LEN]],
    [66,"writev",0x42,[A.FD,A.IOVEC,A.LEN]],
    [67,"pread64",0x43,[A.FD,A.OUTPUT_CHAR_BUFFER,A.SIZE,A.OFFSET]],
    [68,"pwrite64",0x44,[A.FD,"const char *buf",A.SIZE,A.OFFSET]],
    [69,"preadv",0x45,[A.FD,A.IOVEC,A.SIZE.copy('iovcnt'),A.LOFFSET]],
    [70,"pwritev",0x46,[A.FD,A.IOVEC,A.SIZE.copy('iovcnt'),A.LOFFSET]],
    [71,"sendfile",0x47,[A.FD.copy("out_fd"),A.FD.copy("in_fd"),A.OFFSET,A.SIZE]],
    [72,"pselect6",0x48,[{t:T.INT32, n:"nfds"},A.FD_SET.copy("readfds"),A.FD_SET.copy("writefds"),A.FD_SET.copy("exceptfds"),A.KERNEL_TIMESPEC,"const sigset_t *sigmask"]],
    [73,"ppoll",0x49,["struct pollfd *",A.SIZE.copy("nfds"),A.KERNEL_TIMESPEC,"const sigset_t sigmask*"]],
    [74,"signalfd4",0x4a,[A.FD,"sigset_t *user_mask",A.SIZE.copy("sizemask"),{ t:T.INT32, n:"flags", l:L.FLAG, f:X.SFD}]],
    [75,"vmsplice",0x4b,[A.FD,A.IOVEC,A.LEN.copy("nr_segs"),{ t:T.UINT32, n:"flags", l:L.FLAG, f:X.SPLICE}]],
    [76,"splice",0x4c,[{t:T.UINT32, n:"fd_in", l:L.FD},A.LOFFSET.copy('*off_in'),{t:T.UINT32, n:"fd_out", l:L.FD},A.LOFFSET.copy('*off_out'),A.SIZE,"unsigned int flags["]],
    [77,"tee",0x4d,[{t:T.UINT32, n:"fd_in", l:L.FD},{t:T.UINT32, n:"fd_out", l:L.FD},"size_t len","unsigned int flags"]],
    [78,"readlinkat",0x4e,[A.DFD, {t:T.STRING, n:"path", l:L.PATH, c:true},A.OUTPUT_CHAR_BUFFER,A.SIZE]],
    [79,"newfstatat",0x4f,[A.DFD,{t:T.STRING, n:"filename", c:true},{t:T.POINTER64, n:"struct stat *statbuf"}, A.ACCESS_FLAGS],RET.ACCESS],
    [80,"fstat",0x50,[{t:T.UINT32, n:"fd", l:L.FD},{t:T.POINTER64, n:"*statbuf", l:L.DSTRUCT, f:"__old_kernel_stat"}]],
    [81,"sync",0x51,[]],
    [82,"fsync",0x52,[A.FD]],
    [83,"fdatasync",0x53,[A.FD]],
    [84,"sync_file_range",0x54,[A.FD,A.LOFFSET,A.LEN.copy('nbytes'),{ t:T.UINT32, n:"flags", l:L.FLAG, f:X.SYNC_FILE}]],
    [85,"timerfd_create",0x55,[A.CLKID,{ t:T.INT32, n:"flags", l:L.FLAG, f:X.TFD}],A.FD.asReturn([])],
    [86,"timerfd_settime",0x56,[A.FD,{ t:T.INT32, n:"flags", l:L.FLAG, f:X.TIMER},A.CONST_KERNEL_TIMESPEC.copy("new"),"struct __kernel_itimerspec *old"]],
    [87,"timerfd_gettime",0x57,[A.FD,"struct __kernel_itimerspec *curr_val"]],
    [88,"utimensat",0x58,[A.DFD,{t:T.STRING, n:"filename", c:true},A.KERNEL_TIMESPEC.copy("utimes"),"int flags"]],
    [89,"acct",0x59,[{t:T.STRING, n:"name", c:true}]],
    [90,"capget",0x5a,["cap_user_header_t header","cap_user_data_t dataptr"]],
    [91,"capset",0x5b,["cap_user_header_t header","const cap_user_data_t data"]],
    [92,"personality",0x5c,[A.PERSO],A.PERSO.asReturn()],
    [93,"exit",0x5d,[{ t:T.INT32, n:"status" }]],
    [94,"exit_group",0x5e,[{ t:T.INT32, n:"status" }]],
    [95,"waitid",0x5f,[{ t:T.INT32, n:"type_id", l:L.FLAG, f:X.TYPEID},{t:T.UINT32, n:"id"},"struct siginfo *infop","int options","struct rusage *r"]],
    [96,"set_tid_address",0x60,[{t:T.POINTER32, n:"*tidptr"}],A.CALLER_TID],
    [97,"unshare",0x61,[{ t:T.INT32, n:"flags", l:L.FLAG, f:X.CLONE}]],
    [98,"futex",0x62,[ {t:T.UINT32, n:"word", l:L.FUTEX},{ t:T.INT32, n:"op", l:L.FLAG, f:X.FUTEX_OPE}, "u32 val",A.KERNEL_TIMESPEC.copy("*utime"),"u32 *uaddr2","u32 val3["]],
    [99,"set_robust_list",0x63,["struct robust_list_head *head",A.LEN]],
    [100,"get_robust_list",0x64,[A.PID,"struct robust_list_head * *head_ptr","size_t *len_ptr"]],
    [101,"nanosleep",0x65,[A.KERNEL_TIMESPEC.copy("*rqtp"),A.KERNEL_TIMESPEC.copy("*rmtp")]],
    [102,"getitimer",0x66,[A.TIMER,"struct itimerval *value"]],
    [103,"setitimer",0x67,[A.TIMER,"struct itimerval *value","struct itimerval *ovalue"]],
    [104,"kexec_load",0x68,[{t:T.ULONG, n:"entry"},"unsigned long nr_segments","struct kexec_segment *segments","unsigned long flags"]],
    [105,"init_module",0x69,["void *umod","unsigned long len",A.CONST_NAME.copy("uargs")]],
    [106,"delete_module",0x6a,[A.CONST_NAME.copy("name_user"),{ t:T.UINT32, n:"flags", l:L.FLAG, f:X.DEL_KEXT}]],
    [107,"timer_create",0x6b,[A.CLKID,"struct sigevent *timer_event_spec",A.TIMER_PTR.copy("created_timer_id")],{t:T.INT32,e:[E.EAGAIN,E.EINVAL,E.ENOMEM]}],
    [108,"timer_gettime",0x6c,[A.TIMER,"struct __kernel_itimerspec *setting"]],
    [109,"timer_getoverrun",0x6d,[A.TIMER]],
    [110,"timer_settime",0x6e,[A.TIMER,"int flags","const struct __kernel_itimerspec *new_setting","struct __kernel_itimerspec *old_setting"]],
    [111,"timer_delete",0x6f,[A.TIMER]],
    [112,"clock_settime",0x70,[A.CLKID ,A.CONST_KERNEL_TIMESPEC.copy("*tp")]],
    [113,"clock_gettime",0x71,[A.CLKID,A.KERNEL_TIMESPEC.copy("*tp")]],
    [114,"clock_getres",0x72,[A.CLKID,A.KERNEL_TIMESPEC.copy("*tp")]],
    [115,"clock_nanosleep",0x73,[A.CLKID,"int flags",A.CONST_KERNEL_TIMESPEC.copy("*rqtp"),A.KERNEL_TIMESPEC.copy("*rmtp")]],
    [116,"syslog",0x74,["int type",A.OUTPUT_CHAR_BUFFER,A.OUTPUT_BUFFER_LEN]],
    [117,"ptrace",0x75,[{t:T.LONG, n:"request", l:L.FLAG, f:X.PTRACE },{t:T.LONG, n:"pid", l:L.PID },A.ADDR,"unsigned long data"]],
    [118,"sched_setparam",0x76,[A.PID,A.SCHED_PARAM]],
    [119,"sched_setscheduler",0x77,[A.PID,A.SCHED_POLICY,A.SCHED_PARAM]],
    [120,"sched_getscheduler",0x78,[A.PID]],
    [121,"sched_getparam",0x79,[A.PID,A.SCHED_PARAM]],
    [122,"sched_setaffinity",0x7a,[A.PID,A.SIZE.copy("cpusetsize"),"unsigned long *user_mask_ptr"]],
    [123,"sched_getaffinity",0x7b,[A.PID,A.SIZE.copy("cpusetsize"),"unsigned long *user_mask_ptr"]],
    [124,"sched_yield",0x7c,[]],
    [125,"sched_get_priority_max",0x7d,[A.SCHED_POLICY]],
    [126,"sched_get_priority_min",0x7e,[A.SCHED_POLICY]],
    [127,"sched_rr_get_interval",0x7f,[A.PID,A.KERNEL_TIMESPEC.copy("*interval")]],
    [128,"restart_syscall",0x80,[]],
    [129,"kill",0x81,[A.PID,A.SIG]],
    [130,"tkill",0x82,[A.PID,A.SIG]],
    [131,"tgkill",0x83,[{t:T.INT32, n:"thread_grp", l:L.PID },A.PID,A.SIG]],
    [132,"sigaltstack",0x84,["const struct sigaltstack *uss","struct sigaltstack *uoss"]],
    [133,"rt_sigsuspend",0x85,["sigset_t *unewset",A.SIZE.copy("sigsetsize")]],
    [134,"rt_sigaction",0x86,[A.SIG,"const struct sigaction *","struct sigaction *",A.SIZE]],
    [135,"rt_sigprocmask",0x87,[{ t:T.INT32, n:"how", l:L.FLAG, f:X.SIG_FLAGS},"sigset_t *set","sigset_t *oset","size_t sigsetsize"]],
    [136,"rt_sigpending",0x88,["sigset_t *set",A.SIZE.copy("sigsetsize")]],
    [137,"rt_sigtimedwait",0x89,["const sigset_t *uthese","siginfo_t *uinfo",A.CONST_KERNEL_TIMESPEC.copy("*uts"),"size_t sigsetsize"]],
    [138,"rt_sigqueueinfo",0x8a,[A.PID,A.SIG,"siginfo_t *uinfo"]],
    [139,"rt_sigreturn",0x8b,[]],
    [140,"setpriority",0x8c,[A.IOPRIO_WHICH,{t:T.INT32, n:"who"},{t:T.INT32, n:"ioprio"}]],
    [141,"getpriority",0x8d,[A.IOPRIO_WHICH,{t:T.INT32, n:"who"}]],
    [142,"reboot",0x8e,["int magic1","int magic2","unsigned int cmd","void *arg"]],
    [143,"setregid",0x8f,[A.GID.copy("rgid"),A.GID.copy("egid")]],
    [144,"setgid",0x90,[A.GID],RET.INFO],
    [145,"setreuid",0x91,[{t:T.UINT32, n:"real_user", l:L.UID},{t:T.UINT32, n:"effective_user", l:L.UID}],RET.INFO],
    [146,"setuid",0x92,[A.UID],RET.INFO],
    [147,"setresuid",0x93,[{t:T.UINT32, n:"real_user", l:L.UID},{t:T.UINT32, n:"effective_user", l:L.UID},{t:T.UINT32, n:"suid", l:L.UID}],RET.INFO],
    [148,"getresuid",0x94,[{t:T.POINTER64, n:"real_user", l:L.UID},{t:T.POINTER64, n:"effective_user", l:L.UID},{t:T.POINTER64, n:"suid", l:L.UID}]],
    [149,"setresgid",0x95,[{t:T.UINT32, n:"real_grp", l:L.GID},{t:T.UINT32, n:"effective_grp", l:L.GID},{t:T.UINT32, n:"sgid", l:L.GID}],RET.INFO],
    [150,"getresgid",0x96,[{t:T.POINTER64, n:"real_grp", l:L.UID},{t:T.POINTER64, n:"effective_grp", l:L.UID},{t:T.POINTER64, n:"sgid", l:L.UID}],RET.INFO],
    [151,"setfsuid",0x97,[A.UID],RET.INFO],
    [152,"setfsgid",0x98,[A.GID],RET.INFO],
    [153,"times",0x99,["struct tms *tbuf"]],
    [154,"setpgid",0x9a,[A.PID,{t:T.INT32, n:"pgid", l:L.PID }],RET.INFO],
    [155,"getpgid",0x9b,[A.PID]],
    [156,"getsid",0x9c,[A.PID]],
    [157,"setsid",0x9d,[],,RET.INFO],
    [158,"getgroups",0x9e,[A.SIZE,{t:T.POINTER64, n:"grouplist", l:L.GID}]],
    [159,"setgroups",0x9f,[A.SIZE,{t:T.POINTER64, n:"grouplist", l:L.GID}],RET.INFO],
    [160,"uname",0xa0,[{t:T.POINTER64, n:" *utsname" }]],
    [161,"sethostname",0xa1,[{t:T.CHAR_BUFFER, n:"name"},{t:T.UINT32, n:"length"}]],
    [162,"setdomainname",0xa2,[{t:T.CHAR_BUFFER, n:"name"},{t:T.UINT32, n:"length"}]],
    [163,"getrlimit",0xa3,[A.RES,"struct rlimit *rlim"]],
    [164,"setrlimit",0xa4,[A.RES,"struct rlimit *rlim"]],
    [165,"getrusage",0xa5,[{t:T.INT32, n:"who", l:L.ATTRMODE, f:X.RUSAGE},"struct rusage *ru"]],
    [166,"umask",0xa6,[{t:T.UINT32, n:"mask", l:L.ATTRMODE, f:X.ATTR}]],
    [167,"prctl",0xa7,[{t:T.INT32, n:"opt", l:L.FLAG, f:X.PRCTL_OPT},"unsigned long arg2","unsigned long arg3","unsigned long arg4","unsigned long arg5"]],
    [168,"getcpu",0xa8,["unsigned *cpu","unsigned *node","struct getcpu_cache *cache"]],
    [169,"gettimeofday",0xa9,["struct timeval *tv","struct timezone *tz"]],
    [170,"settimeofday",0xaa,["struct timeval *tv","struct timezone *tz"]],
    [171,"adjtimex",0xab,["struct __kernel_timex *txc_p"]],
    [172,"getpid",0xac,[],A.PID],
    [173,"getppid",0xad,[],A.PID],
    [174,"getuid",0xae,[],A.UID],
    [175,"geteuid",0xaf,[],A.UID],
    [176,"getgid",0xb0,[],A.GID],
    [177,"getegid",0xb1,[],A.GID],
    [178,"gettid",0xb2,[]],
    [179,"sysinfo",0xb3,["struct sysinfo *info"]],
    [180,"mq_open",0xb4,[ A.CONST_NAME,A.OFLAGS,A.OMODE,"struct mq_attr *attr"]],
    [181,"mq_unlink",0xb5,[A.CONST_NAME]],
    [182,"mq_timedsend",0xb6,[A.MQD,A.CONST_NAME.copy("*msg_ptr"),A.SIZE.copy("msg_len"),"unsigned int msg_prio",A.CONST_KERNEL_TIMESPEC.copy("*abs_timeout") ]],
    [183,"mq_timedreceive",0xb7,[A.MQD,A.OUTPUT_CHAR_BUFFER.copy("*msg_ptr"),A.SIZE.copy("msg_len"),"unsigned int *msg_prio",A.CONST_KERNEL_TIMESPEC.copy("*abs_timeout")  ]],
    [184,"mq_notify",0xb8,[A.MQD,"const struct sigevent *notification"]],
    [185,"mq_getsetattr",0xb9,[A.MQD,"const struct mq_attr *mqstat","struct mq_attr *omqstat"]],
    [186,"msgget",0xba,["key_t key",{t:T.INT32, n:"msgflg", l:L.FLAG, f:X.MSGF}]],
    [187,"msgctl",0xbb,[A.MQID, {t:T.INT32, n:"cmd", l:L.FLAG, f:X.MSGCTL},"struct msqid_ds *buf"]],
    [188,"msgrcv",0xbc,[A.MQID,"struct msgbuf *msgp",A.SIZE.copy("msgsz"),"long msgtyp",{t:T.INT32, n:"msgflg", l:L.FLAG, f:X.MSGF}]],
    [189,"msgsnd",0xbd,[A.MQID,"struct msgbuf *msgp",A.SIZE.copy("msgsz"),{t:T.INT32, n:"msgflg", l:L.FLAG, f:X.MSGF}]],
    [190,"semget",0xbe,["key_t key",A.SIZE.copy("nsems"),"int semflg"]],
    [191,"semctl",0xbf,[A.SEMID,"int semnum","int cmd","unsigned long arg"]],
    [192,"semtimedop",0xc0,[A.SEMID,"struct sembuf *sops","unsigned nsops",A.CONST_KERNEL_TIMESPEC.copy("*timeout") ]],
    [193,"semop",0xc1,[A.SEMID,"struct sembuf *sops","unsigned nsops"]],
    [194,"shmget",0xc2,["key_t key","size_t size","int flag"]],
    [195,"shmctl",0xc3,["int shmid","int cmd","struct shmid_ds *buf"]],
    [196,"shmat",0xc4,["int shmid","void *shmaddr","int shmflg"]],
    [197,"shmdt",0xc5,["void *shmaddr"]],
    [198,"socket",0xc6,[{t:T.INT32, n:"domain", l:L.FLAG, f:X.PF},{t:T.INT32, n:"type", l:L.FLAG, f:X.SOCK},"int"],A.SOCKFD.asReturn([/* TODO */])],
    [199,"socketpair",0xc7,["int","int","int","int *"]],
    [200,"bind",0xc8,[A.SOCKFD,"struct sockaddr *","int"]],
    [201,"listen",0xc9,[A.SOCKFD,A.LEN]],
    [202,"accept",0xca,[A.SOCKFD,"struct sockaddr *","int *"]],
    [203,"connect",0xcb,[A.FD,"struct sockaddr *","int"]],
    [204,"getsockname",0xcc,[A.SOCKFD,"struct sockaddr *","int *"]],
    [205,"getpeername",0xcd,[A.SOCKFD,"struct sockaddr *","int *"]],
    [206,"sendto",0xce,[A.SOCKFD,"void *",A.SIZE,"unsigned","struct sockaddr *","int"]],
    [207,"recvfrom",0xcf,[A.SOCKFD,"void *",A.SIZE,"unsigned","struct sockaddr *","int *"]],
    [208,"setsockopt",0xd0,[A.SOCKFD,"int level","int optname","void *optval","int optlen"]],
    [209,"getsockopt",0xd1,[A.SOCKFD,"int level","int optname","void *optval","int *optlen"]],
    [210,"shutdown",0xd2,[A.SOCKFD,"int"]],
    [211,"sendmsg",0xd3,[A.SOCKFD ,"struct user_msghdr *msg","unsigned flags"]],
    [212,"recvmsg",0xd4,[A.SOCKFD,"struct user_msghdr *msg","unsigned flags"]],
    [213,"readahead",0xd5,[A.SOCKFD,"loff_t offset","size_t count"]],
    [214,"brk",0xd6,[A.ADDR.copy("*end_data_seg")]],
    [215,"munmap",0xd7,[A.ADDR,A.SIZE],{t:T.INT32, e:[E.EINVAL]}],
    [216,"mremap",0xd8,[A.ADDR,"unsigned long old_len","unsigned long new_len","unsigned long flags",A.ADDR]],
    [217,"add_key",0xd9,[A.CONST_NAME.copy("*type"),A.CONST_NAME.copy("*description"),"const void *_payload",A.SIZE.copy("plen"),"key_serial_t destringid"]],
    [218,"request_key",0xda,[A.CONST_NAME.copy("*type"),A.CONST_NAME.copy("*description"),A.CONST_NAME.copy("*callout_info"),"key_serial_t destringid"]],
    [219,"keyctl",0xdb,["int cmd","unsigned long arg2","unsigned long arg3","unsigned long arg4","unsigned long arg5"]],
    [220,"clone",0xdc,["unsigned long","unsigned long","int *","int *","unsigned long"]],
    [221,"execve",0xdd,[ {t:T.STRING, n:"filename", c:true},{t:T.STRING, n:"*argv", c:true},{t:T.STRING, n:"*envp", c:true}]],
    [222,"mmap",0xde,[A.START_ADDR,A.SIZE, A.MPROT, {t:T.INT32, n:"flags", l:L.FLAG, f:X.MAP}, {t:T.UINT32, n:"fd", l:L.MFD},A.OFFSET],RET.VADDR],
    [223,"fadvise64",0xdf,[{t:T.UINT32, n:"fd", l:L.FD},"loff_t offset",A.SIZE,"int advice"]],
    [224,"swapon",0xe0,[A.CONST_FNAME,"int swap_flags"]],
    [225,"swapoff",0xe1,[A.CONST_FNAME]],
    [226,"mprotect",0xe2,[A.ADDR,A.SIZE, A.MPROT],{t:T.INT32, e:[E.EACCES,E.EFAULT,E.EINVAL,E.ENOMEM]}],
    [227,"msync",0xe3,[A.ADDR,A.SIZE,{t:T.ULONG, n:"flags", l:L.FLAG, f:X.MS}],{t:T.INT32, e:[E.EBUSY,E.EINVAL,E.ENOMEM]}],
    [228,"mlock",0xe4,[A.ADDR,A.SIZE],{t:T.INT32, e:[E.EPERM,E.EINVAL,E.ENOMEM]}],
    [229,"munlock",0xe5,[A.ADDR,A.SIZE],{t:T.INT32, e:[E.EPERM,E.EINVAL,E.ENOMEM]}],
    [230,"mlockall",0xe6,[{t:T.INT32, n:"flags", l:L.FLAG, f:X.MCL}],{t:T.INT32, e:[E.EPERM,E.EINVAL,E.ENOMEM]}],
    [231,"munlockall",0xe7,[],{t:T.INT32, e:[E.EPERM,E.EINVAL,E.ENOMEM]}],
    [232,"mincore",0xe8,[A.ADDR,A.SIZE,"unsigned char * vec"]],
    [233,"madvise",0xe9,[A.ADDR,A.SIZE, {t:T.INT32, n:"behavior", l:L.FLAG, f:X.MADV}],{ t:T.INT32, e:[E.EAGAIN,E.EBADF,E.EINVAL,E.EIO, E.ENOMEM]}],
    [234,"remap_file_pages",0xea,[A.START_ADDR,A.LEN,"unsigned long prot","unsigned long pgoff","unsigned long flags"]],
    [235,"mbind",0xeb,[A.ADDR,A.LEN,"unsigned long mode","const unsigned long *nmask","unsigned long maxnode","unsigned flags"]],
    [236,"get_mempolicy",0xec,["int *policy","unsigned long *nmask","unsigned long maxnode","unsigned long addr","unsigned long flags"]],
    [237,"set_mempolicy",0xed,["int mode","const unsigned long *nmask","unsigned long maxnode"]],
    [238,"migrate_pages",0xee,[{t:T.INT32, n:"pid", l:L.PID },"unsigned long maxnode","const unsigned long *from","const unsigned long *to"]],
    [239,"move_pages",0xef,[{t:T.INT32, n:"pid", l:L.PID },"unsigned long nr_pages","const void * *pages","const int *nodes","int *status","int flags"]],
    [240,"rt_tgsigqueueinfo",0xf0,[{t:T.INT32, n:"tgid", l:L.PID },A.PID,A.SIG,"siginfo_t *uinfo"]],
    [241,"perf_event_open",0xf1,["struct perf_event_attr *attr_uptr",{t:T.INT32, n:"pid", l:L.PID },"int cpu","int group_fd","unsigned long flags"]],
    [242,"accept4",0xf2,[A.SOCKFD,"struct sockaddr *",A.SIZE.out(),{t:T.INT32, n:"type", l:L.FLAG, f:X.SOCKF}]],
    [243,"recvmmsg",0xf3,[ {t:T.UINT32, n:"fd", l:L.FD},"struct mmsghdr *msg","unsigned int vlen","unsigned flags",A.KERNEL_TIMESPEC.copy("*timeout") ]],
    [244,"not implemented 244",0xf4,[]],
    [245,"not implemented 245",0xf5,[]],
    [246,"not implemented 246",0xf6,[]],
    [247,"not implemented 247",0xf7,[]],
    [248,"not implemented 248",0xf8,[]],
    [249,"not implemented 249",0xf9,[]],
    [250,"not implemented 250",0xfa,[]],
    [251,"not implemented 251",0xfb,[]],
    [252,"not implemented 252",0xfc,[]],
    [253,"not implemented 253",0xfd,[]],
    [254,"not implemented 254",0xfe,[]],
    [255,"not implemented 255",0xff,[]],
    [256,"not implemented 256",0x100,[]],
    [257,"not implemented 257",0x101,[]],
    [258,"not implemented 258",0x102,[]],
    [259,"not implemented 259",0x103,[]],
    [260,"wait4",0x104,[A.PID,"int *stat_addr","int options","struct rusage *ru"]],
    [261,"prlimit64",0x105,[A.PID,A.RES,"const struct rlimit64 *new_rlim","struct rlimit64 *old_rlim"]],
    [262,"fanotify_init",0x106,["unsigned int flags","unsigned int event_f_flags"]],
    [263,"fanotify_mark",0x107,["int fanotify_fd","unsigned int flags","u64 mask",{t:T.UINT32, n:"fd", l:L.FD},A.CONST_PATH]],
    [264,"name_to_handle_at",0x108,[{t:T.INT32, n:"dfd", l:L.DFD},{t:T.STRING, n:"name", c:true},"struct file_handle *handle","int *mnt_id","int flag"]],
    [265,"open_by_handle_at",0x109,["int mountdirfd","struct file_handle *handle","int flags"]],
    [266,"clock_adjtime",0x10a,[A.CLKID,"struct __kernel_timex *tx"]],
    [267,"syncfs",0x10b,[{t:T.UINT32, n:"fd", l:L.FD}]],
    [268,"setns",0x10c,[{t:T.UINT32, n:"fd", l:L.FD},"int nstype"]],
    [269,"sendmmsg",0x10d,[{t:T.UINT32, n:"fd", l:L.FD},"struct mmsghdr *msg","unsigned int vlen","unsigned flags"]],
    [270,"process_vm_readv",0x10e,[{t:T.INT32, n:"pid", l:L.PID },A.IOVEC.copy("lvec"),A.LEN.copy("liovcnt"),A.IOVEC.copy("rvec"),A.LEN.copy("riovcnt"),"unsigned long flags"]],
    [271,"process_vm_writev",0x10f,[{t:T.INT32, n:"pid", l:L.PID },A.IOVEC.copy("lvec"),A.LEN.copy("liovcnt"),A.IOVEC.copy("rvec"),A.LEN.copy("riovcnt"),"unsigned long flags"]],
    [272,"kcmp",0x110,[A.PID.copy("pid1"),A.PID.copy("pid2"),"int type","unsigned long idx1","unsigned long idx2"]],
    [273,"finit_module",0x111,[{t:T.UINT32, n:"fd", l:L.FD},A.CONST_NAME.copy("uargs"),"int flags"]],
    [274,"sched_setattr",0x112,[A.PID,"struct sched_attr *attr","unsigned int flags"]],
    [275,"sched_getattr",0x113,[A.PID,"struct sched_attr *attr","unsigned int size","unsigned int flags"]],
    [276,"renameat2",0x114,[A.OLD_DFD,A.OLD_NAME,A.NEW_DFD,A.NEW_NAME,"unsigned int flags"]],
    [277,"seccomp",0x115,[{t:T.UINT32, n:"ope", l:L.FLAG, f:X.SECCOMP},{t:T.UINT32, n:"flags", l:L.FLAG, f:X.SECCOMP_FLAGS, r:1},"void *uargs"]],
    [278,"getrandom",0x116,[{t:T.CHAR_BUFFER, n:"buf", l:L.OUTPUT_BUFFER},"size_t count","unsigned int flags"]],
    [279,"memfd_create",0x117,[{t:T.CHAR_BUFFER, n:"filename", l:L.PATH},{t:T.UINT32, n:"flags", l:L.FLAG, f:X.MFD}],{t:T.UINT32, n:"mfd", l:L.FD, e:[E.EFAULT,E.EINVAL,E.EMFILE,E.ENFILE,E.ENOMEM]}],
    [280,"bpf",0x118,["int cmd","union bpf_attr *attr","unsigned int size"]],
    [281,"execveat",0x119,[{t:T.INT32, n:"dfd", l:L.DFD},{t:T.STRING, n:"filename", c:true},A.CONST_NAME.copy("*argv"),A.CONST_NAME.copy("*envp"),"int flags"]],
    [282,"userfaultfd",0x11a,[A.OFLAGS]],
    [283,"membarrier",0x11b,[{t:T.INT32, n:"cmd", l:L.FLAG, f:X.MEMBARRIER_CMD}, {t:T.INT32, n:"glag", l:L.FLAG, f:X.MEMBARRIER_FLAG}]],
    [284,"mlock2",0x11c,[A.START_ADDR,A.SIZE,{t:T.UINT32, n:"flags", l:L.FLAG, f:X.MLOCK }]],
    [285,"copy_file_range",0x11d,[{t:T.UINT32, n:"fd_in", l:L.FD},A.LOFFSET.copy('*off_in'),{t:T.UINT32, n:"fd_out", l:L.FD},A.LOFFSET.copy('*off_out'),A.SIZE,"unsigned int RESERVED flags"]],
    [286,"preadv2",0x11e,[A.LFD,A.IOVEC,A.LEN,A.LOFFSET,A.RWF]],
    [287,"pwritev2",0x11f,[A.LFD,A.IOVEC,A.LEN,A.LOFFSET,A.RWF]],
    [288,"pkey_mprotect",0x120,[A.ADDR,A.SIZE,A.MPROT,A.PKEY]],
    [289,"pkey_alloc",0x121,["unsigned long RESERVED flags",{t:T.ULONG, n:"access_rights", l:L.FLAG, f:X.PKEY_ACL }],A.PKEY],
    [290,"pkey_free",0x122,[A.PKEY]],
    [291,"statx",0x123,[A.DFD, A.CONST_PATH,A.ACCESS_FLAGS,"unsigned mask","struct statx *buffer"]]
    ];

const SVC_MAP_NUM:any = {};
const SVC_MAP_NAME:any = {};

SVC.map(x => {
    SVC_MAP_NAME[x[1] as string] = x;
    SVC_MAP_NUM[x[0] as string] = x;
});

let isExcludedFn:any = null;

export const KAPI = {
    CONST: DEF,
    SVC: SVC_MAP_NAME,
    SVC_ARG: SVC_ARG,
    ERR: DEF.ERR
};

export class LinuxArm64InterruptorAgent extends InterruptorAgent{

    loadCtr:number = 0;

    filter_name: string[] = [];
    filter_num: string[] = [];
    svc_hk: any = {};
    hvc_hk: any = {};
    smc_hk: any = {};
    irq_hk: any = {};

    constructor(pConfig:any, pDoFollowThread:any) {
        super(pConfig, pDoFollowThread);
        this.configure(pConfig);
    }

    _setupDelegateFilters( pTypes:string, pOpts:any):void {
        if(pOpts == null) return;

        const o = pOpts;
        const f = this[pTypes];

        ["svc","hvc","smc"].map( x => {
            if(o.hasOwnProperty(x))
                f[x] = o[x];
        });

        if(f.hasOwnProperty("syscalls") && f.syscalls != null){
            f.svc = this.getSyscallList(f.syscalls);
        }
    }

    configure(pConfig:any){
        if(pConfig == null) return;

        for(let k in pConfig){
            switch (k){
                case 'svc':
                    for(let s in pConfig.svc) this.onSupervisorCall(s, pConfig.svc[s]);
                    break;
                case 'hvc':
                    for(let s in pConfig.hvc) this.onHypervisorCall((s as any).parseInt(16), pConfig.hvc[s]);
                    break;
                case 'filter_name':
                    this.filter_name = pConfig.filter_name;
                    break;
                case 'filter_num':
                    this.filter_num = pConfig.filter_num;
                    break;
            }
        }

        this.setupBuiltinHook();
    }

    protected _updateScope(pScope:any):void {
        switch ( this._policy.svc){
            case F.INCLUDE_ANY:
                isExcludedFn = (x)=>{ return (this._scope.svc.indexOf(x)>-1); };
                break;
            case F.EXCLUDE_ANY:
                isExcludedFn = (x)=>{ return (this._scope.svc.indexOf(x)==-1);};
                break;
            case F.FILTER:
                isExcludedFn = (x)=>{ return (this._scope.svc.i.indexOf(x)==-1 || this._scope.svc.e.indexOf(x)>-1);};
                break;
        }
    }

    /**
     * To generate a filtered list of syscalls
     * @param {string[]} pSyscalls An array of syscall number
     * @method
     */
    getSyscallList( pSyscalls:any ):any {

        const list = [];

        switch(typeof pSyscalls){
            case "string":
                SVC.map( x => { if(x[1]==pSyscalls) list.push(x[SVC_NUM]); });
                break;
            case "function":
                SVC.map( x => { if(pSyscalls.apply(null, x)) list.push(x[SVC_NUM]); });
                break;
            case "object":
                if(Array.isArray(pSyscalls)){
                    pSyscalls.map( sVal => {
                        switch(typeof sVal){
                            case "string":
                                SVC.map( x => { if(x[SVC_NAME]==sVal) list.push(x[SVC_NUM]); });
                                break;
                            case "number":
                                SVC.map( x => { if(x[SVC_NUM]==sVal) list.push(x[SVC_NUM]); });
                                break;
                            case "object":
                                SVC.map( x => { if(sVal.exec(x[SVC_NAME])!=null) list.push(x[SVC_NUM]); });
                                break;
                        }
                    })
                }else if (pSyscalls instanceof RegExp){
                    SVC.map( x => { if(pSyscalls.exec(x[1])!=null) list.push(x[0]); });
                }else{
                    SVC.map(x => { list.push(x[SVC_NUM]); });
                }
                break;
            default:
                SVC.map(x => { list.push(x[SVC_NUM]); });
                break;
        }

        return list;
    }

    onSupervisorCall(pIntName:string, pHooks:any){
        const sc = SVC_MAP_NAME[pIntName];
        if(sc == null) throw InterruptorGenericException.UNKNOW_SYSCALL(pIntName);
        if(pHooks.hasOwnProperty('onEnter') || pHooks.hasOwnProperty('onLeave')){
            this.svc_hk[sc[0]] = pHooks
        }

    }

    onHypervisorCall(pIntNum:number, pHooks:any){
        if(pHooks.hasOwnProperty('onEnter') || pHooks.hasOwnProperty('onLeave')){
            this.hvc_hk[pIntNum] = pHooks
        }

    }

    setupBuiltinHook(){
    }

    locatePC( pContext: any):string{
        let l = "", tid:number =-1;
        const r = Process.findRangeByAddress(pContext.pc);

        if(this.output.tid) {
            tid = Process.getCurrentThreadId();
            l += `\x1b[1;${this.output._tcolor}m [TID=${tid}] \x1b[0m`;

        }

        if(this.output.module){
            if(r != null){
                if(r.file != null){
                    if(this.output.hidePackage!=null){
                        l +=  `[${ r.file.path.replace(this.output.hidePackage, "HIDDEN")} +${pContext.pc.sub(r.base)}]`; ;
                    }else{
                        l +=  `[${ r.file.path } +${pContext.pc.sub(r.base)}]`; ;
                    }
                }else{
                    l +=  `[${r.base} +${pContext.pc.sub(r.base)}]`; ;
                }
            }else{
                l += `[<unknow>  lr=${pContext.lr}]`;
            }
        }

        if(this.output.lr)
            l += `[lr=${pContext.lr}]`;

        return l;
    }

    startOnLoad( pModuleRegExp:RegExp, pOptions:any = null):any {
        let self=this, do_dlopen = null, call_ctor = null, scopedTrace = null, extra = null, match=null;
        let opts = pOptions;
        Process.findModuleByName('linker64').enumerateSymbols().forEach(sym => {
            if (sym.name.indexOf('do_dlopen') >= 0) {
                do_dlopen = sym.address;
            } else if (sym.name.indexOf('call_constructor') >= 0) {
                call_ctor = sym.address;
            } else if(sym.name.indexOf('__dl__ZN11ScopedTrace3EndEv') >= 0){
                scopedTrace = sym.address;
            }
        });

        if(this.emulator && scopedTrace!=null){
            const ScopedTraceEnd = new NativeCallback(():number=>{
                return 1;
            }, 'int', ['int']);

            Interceptor.replace(scopedTrace, ScopedTraceEnd);
        }

        if(extra != null){
            Interceptor.attach(extra,  {
                onEnter: function(args){
                    this.out = args[0];
                    console.log( hexdump(this.out,{length:64}) );
                },
                onLeave: function(ret){

                    //console.log( hexdump(this.out,{length:64}) );
                }
            });
        }


        Interceptor.attach(do_dlopen, function (args) {
            const p = args[0].readUtf8String();

            if(p!=null && pModuleRegExp.exec(p) != null){
                match = p;
            }
        });

        Interceptor.attach(call_ctor, {
            onEnter:function () {
                if(match==null) return;
                const tmp = match;

                console.warn("[LINKER] Loading '"+match+"'");
                if(pOptions!=null && pOptions.hasOwnProperty('condition')){
                    if(!pOptions.condition(match, this)){
                        match = null;
                        return ;
                    }
                }



                console.warn("[INTERRUPTOR][STARTING] Module '"+match+"' is loading, tracer will start");
                match = null;

                self.start();

                if(pOptions!=null && pOptions.hasOwnProperty('threshold')){
                    //console.log(self.loadCtr, pOptions.threshold)
                    if(self.loadCtr < pOptions.threshold){
                        self.loadCtr++;
                        self.onStart( tmp, this);
                    }else{
                        console.warn("[INTERRUPTOR][STARTING] Threshold reached");
                        match = null;
                        return ;
                    }
                }else{
                    self.onStart( tmp, this);
                }

            }
        });
    }

    /**
     * To parse memory according to the structure defined by *pFormat*
     *
     * @param pContext CPU context
     * @param pFormat
     * @param pPointer
     * @method
     */
    parseStruct( pContext:any, pFormats:TypedData[], pPointer:NativePointer, pSeparator:string ="\n", pAlign:boolean = false):string {

        let msg:string = " {"+pSeparator;
        let fmt:TypedData = null, v:string = "", val:any = null;
        let offset:number =0;

        //console.log("DSTRUCT",JSON.stringify(pFormats));

        for(let i=0; i<pFormats.length; i++){
            fmt = pFormats[i];
            //console.log("TYPED_DATA",JSON.stringify(fmt));
            switch(fmt.t){
                case T.SHORT:
                    val = pPointer.add(offset).readShort();
                    offset += 2;
                    break;
                case T.USHORT:
                    val = pPointer.add(offset).readUShort();
                    offset += 2;
                    break;
                case T.INT32:
                    val = pPointer.add(offset).readInt();
                    offset += 4;
                    break;
                case T.UINT32:
                    val = pPointer.add(offset).readU32();
                    offset += 4;
                    break;
                case T.LONG:
                    val = pPointer.add(offset).readLong();
                    offset += 8;
                    break;
                case T.ULONG:
                    val = pPointer.add(offset).readULong();
                    offset += 8;
                    break;
                case T.POINTER64:
                    val = pPointer.add(offset).readULong();
                    offset += 8;
                    break;

            }
            //console.log(JSON.stringify(fmt),val,i);
            v = this.parseValue( pContext, val, fmt, i);
            msg += ` \t${fmt.n} = ${v},${pSeparator}`;
        }

        return msg+pSeparator+" }";
    }

    /**
     *
     * @param pContext
     * @param pValue
     * @param pFormat
     * @param pIndex
     */
    parseValue( pContext:any, pValue:any, pFormat:any, pIndex:number):any {
        let p: string = "", rVal: any = null, t: any = null;


        if (typeof pFormat === "string") {
            p = pValue; //` ${pFormat} = ${pValue}`;
        } else {
            rVal = pValue;
            //p += ` ${pFormat.n} = `;

            const f = pFormat.f;

            switch (pFormat.l) {
                case L.DFD:
                    t = rVal.toInt32();
                    if (t >= 0)
                        p += `${t}  `;
                    else if (t == AT_.AT_FDCWD)
                        p += "AT_FDCWD "
                    else
                        p += rVal + " ERR?";
                    break;
                case L.MFD:
                    /*
                    Value of FD while mmap() depends of others args
                    todo : inject api into context to access current syscall data  : pContext.svc.mmap.flags
                     */
                    t = rVal.toInt32();
                    if (pContext.dxc.FD!=null && t >= 0)
                        p += `${t}  ${pContext.dxc.FD[rVal.toInt32() + ""]}  `;
                    else if ((t & MAP_.MAP_ANONYMOUS[0]) == MAP_.MAP_ANONYMOUS[0])
                        p += `${t} IGNORED  `
                    else
                        p += t + " ";
                    return;
                case L.FD:
                    t = rVal.toInt32();
                    if (pContext.dxc.FD!=null && t >= 0)
                        p += `${t}  ${pContext.dxc.FD[t + ""]}  `;
                    else if (t == AT_.AT_FDCWD)
                        p += "AT_FDCWD "
                    else
                        p += rVal + " ";
                    break;
                case L.SOCKFD:
                    t = rVal.toInt32();
                    if (pContext.dxc.SOCKFD!=null &&  t >= 0)
                        p += `${t}  ${pContext.dxc.SOCKFD[t + ""]}  `;
                    p += rVal + " ";
                    break;
                case L.WD:
                    t = rVal.toInt32();
                    if (pContext.dxc.WD!=null && t >= 0)
                        p += `${t}  ${pContext.dxc.WD[t + ""]}  `;
                        p += rVal + " ";
                    break;
                case L.VADDR:
                    if (pFormat.f == null) {
                        p += pContext.dxcOpts[pFormat] = rVal;
                        break;
                    }
                case L.FLAG:
                    if (pFormat.r != null) {
                        if (Array.isArray(pFormat.r)) {
                            let t = [];
                            pFormat.r.map(x => t.push(pContext[x]));
                            p += `${(pFormat.f)(rVal, t)}`;
                        } else {
                            p += `${(pFormat.f)(rVal, [pContext[pFormat.r]])}`;
                        }
                    } else {
                        p += `${(pFormat.f)(rVal)}`;
                    }
                    pContext.dxcOpts[pIndex] = rVal;
                    break;
                case L.DSTRUCT:
                    if(this.types!=null && this.types[pFormat.f] != null){
                        if (pContext.dxcOpts._extra == null) pContext.dxcOpts._extra = [];
                        pFormat.r = pIndex;
                        pFormat.v = rVal;
                        pContext.dxcOpts._extra.push(pFormat);
                        pContext.dxcOpts[pIndex] = rVal;

                        p += `${rVal} ${pFormat.c===true ? this.parseStruct( pContext, this.types[pFormat.f].getStruct(), pFormat.v, "" ) : ""}`;
                        break;
                    }
                default:
                    switch (pFormat.t) {
                        case T.STRING:
                            p += pContext.dxcOpts[pIndex] = rVal.readCString();
                            break;
                        case T.CHAR_BUFFER:
                            p += pContext.dxcOpts[pIndex] = rVal.readCString();
                            break;
                        case T.UINT32:
                        default:
                            p += pContext.dxcOpts[pIndex] = rVal;
                            break;
                    }
                    break;
            }
        }

        return p;
    }
    /**
     *
     * @param pContext
     * @param pFormat
     * @param pIndex
     */
    parseRawArgs( pContext:any, pFormat:any, pIndex:number):any {

        if (typeof pFormat === "string") {
            return` ${pFormat} = ${pContext[GPR + pIndex] }`;
        } else {
            return` ${pFormat.n} = ${this.parseValue( pContext, pContext[GPR + pIndex], pFormat, pIndex ) }`;
        }
    }

    traceSyscall( pContext:any, pHookCfg:any = null){

        const sys = SVC_MAP_NUM[ pContext.x8.toInt32() ];
        var inst = "SVC";

        if(sys==null) {
            console.log( ' ['+this.locatePC(pContext.pc)+']   \x1b[35;01m' + inst + ' ('+pContext.x8+')\x1b[0m Syscall=<unknow>');
            return;
        }

        pContext.dxcRET = sys[SVC_RET];

        let s:string = "", p:string= "", t:any=null;
        pContext.dxcOpts = [];
        sys[3].map((vVal,vOff) => {
            //const rVal = pContext["x"+vOff];
            p += ` ${this.parseRawArgs(pContext, vVal, vOff)} ,`;
        });
        s = `${sys[1]} ( ${p.slice(0,-1)} ) `;

        if(this.output.flavor == InterruptorAgent.FLAVOR_DXC){
            pContext.log = this.formatLogLine(pContext, s, inst, pContext.x8)
        }

    }

    /**
     *
     * @param pContext
     * @param pSysc
     * @param pInst
     * @param pSysNum
     */
    formatLogLine( pContext:any, pSysc:string, pInst:string, pSysNum:number):string {
        let s = this.locatePC(pContext);
        s += this.output.inst ?  `   \x1b[35;01m${pInst} :: ${pSysNum} \x1b[0m` : "";
        s += `   ${pSysc}`;
        return s;
    }

    getSyscallError( pErrRet:number, pErrEnum:any[]):any {
        for(let i=0; i<pErrEnum.length ; i++){
            if(pErrRet === -pErrEnum[i][0] ){
                return pErrRet+' '+pErrEnum[i][2];
            }
        }
        return pErrRet;
    }

    traceSyscallRet( pContext:any, pHookCfg:any = null){


        let err;
        let ret = pContext.dxcRET;
        let post:string = null;
        if(ret != null){

            switch (ret.l) {
                case L.SIZE:
                    if(this.output.dump_buff)
                        ret = "(len="+pContext.x0+") "; //+pContext["x"+ret.r].readCString();
                    else
                        ret = pContext.x0;
                    break;
                case L.DFD:
                case L.FD:
                    if(pContext.x0.toInt32() >= 0){
                        if(pContext.dxc==null){
                            pContext.dxc = {FD:{}};
                            pContext.dxcFD = pContext.dxc.FD = {};
                        }
                        if(pContext.dxc.FD==null){
                            pContext.dxcFD = pContext.dxc.FD = {};
                        }
                        pContext.dxc.FD[ pContext.x0.toInt32()+""] = pContext.dxcOpts[ret.r];
                        ret = "("+(L.DFD==ret.l?"D":"")+"FD) "+pContext.x0;
                    }else if(ret.e){
                        let err = this.getSyscallError(pContext.x0.toInt32(), ret.e);
                        ret = "(ERROR) "+err+" "  ;
                    }else{
                        ret = "(ERROR) "+pContext.x0;
                    }

                    break;
                case L.SOCKFD:
                    if(pContext.x0.toInt32() >= 0){
                        pContext.dxc.SOCKFD[ pContext.x0.toInt32()+""] = pContext.dxcOpts["x1"]+","+pContext.dxcOpts["x2"];
                        ret = "(SOCKFD) "+pContext.x0;
                    }else if(ret.e){
                        let err = this.getSyscallError(pContext.x0.toInt32(), ret.e);
                        ret = "(ERROR) "+err+" "  ;
                    }else{
                        ret = "(ERROR) "+pContext.x0;
                    }
                case L.WD:
                    if(pContext.x0.toInt32() >= 0){
                        pContext.dxc.WD[ pContext.x0.toInt32()+""] = pContext.dxcOpts[ret.r];
                        ret = "(WD) "+pContext.x0;
                    }else if(ret.e){
                        let err = this.getSyscallError(pContext.x0.toInt32(), ret.e);
                        ret = "(ERROR) "+err+" "  ;
                    }else{
                        ret = "(ERROR) "+pContext.x0;
                    }

                    break;
                case L.FCNTL_RET:
                    ret = X.FCNTL_RET(pContext.x0, pContext.x1);
                    break;
                case L.VADDR:
                    if(ret.e != null ){
                        err = this.getSyscallError(pContext.x0, ret.e);
                        if(err != pContext.x0){
                            ret = pContext.x0+' SUCCESS';
                        }else{
                            ret = err ;
                        }
                    }
                    break;
                default:
                    if(ret.e != null ){
                        err = this.getSyscallError(pContext.x0.toInt32(), ret.e);
                        if(err == 0){
                            ret = pContext.x0.toUInt32().toString(16)+' SUCCESS';
                        }else{
                            ret = err ;
                        }
                    }
                    else
                        ret = pContext.x0.toUInt32().toString(16);
                    break;
            }
        }else{
           ret = pContext.x0;
        }

        console.log( pContext.log +'   > '+ret);0

        // to process extra data such as structured data edited or passed as args
        if(pContext.dxcOpts != null && pContext.dxcOpts._extra){
            pContext.dxcOpts._extra.map( x => {

                console.log(` ${x.n} = `+this.parseStruct(
                    pContext,
                    this.types[x.f].getStruct(),
                    (x.v != null ?
                        // if the pointer has been saved before to call the syscall, then it uses saved value
                        x.v :
                        // if the register holding the pointer has been modified by the syscall, then it read register value
                        pContext.dxcOpts[x.r] )
                ));
            });
        }

    }


    trace( pStalkerInterator:any, pInstruction:any, pExtra:any):number{


        const self = this;

        let keep = 1;
        if(pExtra.onLeave == 1){

            pStalkerInterator.putCallout(function(context) {
                const n = context.x8.toInt32();
                if(context.dxc==null) context.dxc = {FD:{}};
                if(isExcludedFn!=null && isExcludedFn(n)) return;

                self.traceSyscallRet(context);

                const hook = self.svc_hk[n];
                if(hook == null) return ;

                if(hook.onLeave != null){
                    (hook.onLeave)(context);
                }
            });

            pExtra.onLeave = null;
        }

        // debug
        //console.log("["+pInstruction.address+" : "+pInstruction.address.sub(pExtra.mod.__mod.base)+"] > "+Instruction.parse(pInstruction.address));

        if (pInstruction.mnemonic === 'svc') {

            //console.log("SVC Found : > "+pInstruction.mnemonic);
            pExtra.onLeave =  1;
            pStalkerInterator.putCallout(function(context) {

                const n = context.x8.toInt32();

                if(isExcludedFn!=null && isExcludedFn(n)) return;

                if(context.dxc==null) context.dxc = {FD:{}};
                const hook = self.svc_hk[n];


                if(hook != null && hook.onEnter != null) (hook.onEnter)(context);

                self.traceSyscall(context, hook);

            });
        }

        return keep;
    }
}