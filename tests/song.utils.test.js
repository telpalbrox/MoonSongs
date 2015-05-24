/**
 * Created by alberto on 19/03/15.
 */
require('../app/models/song');
var should = require('should'),
  songUtils = require('../app/libs/song.lib'),
  mongoose = require('mongoose'),
  Song = mongoose.model('Song');

var songHachico, songVeloma;

describe('SongUtils tests', function() {
  beforeEach(function () {
    songHachico = {
      artist: 'The Kyoto Connection',
      album: 'Wake Up',
      title: 'Hachiko (The Faithtful Dog)',
      path: 'assets/demo_music/The Kyoto Connection/Wake Up/Hachiko (The Faithtful Dog).mp3',
      fprint: 'AQADtFKyLEmSRMUPM4mm48H_FOfR43KGXEjmoHmLM_iD5kmO5uTx4NoRZknKIfnR489wvsF1PAmao39wnsiDBMeVxDt-NM8Qng-SHx-eNEZzBX2D7zhy6A_yC01doWI8PBOP5gvRnoObKXlxfD-eMkeyfKIQOjou4fDDBz8uVMylHI10xcib49AXPI1wY1uSBJcd5Af14w_uFEwu9Ph24sF1I1w0YodfCCfqJMOlIE-fICSvoHnwHdfx4A-aHX2WMDhwNcfQCx511MfB8FdwgVdeiFOiI-x7PMw4ouexXcOPJ5mP5sePfIOWI6TiCt8cnDZ8vMEfooc_3PCPWjp-Do1D9ML34xf6wj9O9bjxHS_yGPoRzkftH1fh6jieo5YdPD2u4UGP5gzyHLqCwF-Czzke9ETjFD_6HI2T40ZdOTjctUiOvMcTGr1wabh0NMcffEiWPUEuPMevoezkovmRCwlxY1eOw4-OPdHh43gSlQhtKhCPcA2Pvzi-CDUfYfuDkjmQC8mDRzmePCmKMEdyadizEI-E-vB_9DnwIPmRD__xVNrh0Cm-4Dce5rgSFd_xckeYfOmQ7MOVk_iP5hX64DkqpomEZvKSBE9W_MgFPcHj4Tq8JMmP3Oi-YMp7PHngJgt44jeuB-URkUnm4Cp8Q8OOEweP_yi548_xH8d5HMcPu0Z9DM0T4UEz3biiD3-CPriCH7-hUZkuXIkC7bC6pEOfvdBFJXgUGs-OvGjQ48mMMIeG_LiGZtNQHk9VNFbKot1w9EXT6njQ0kXTH5dw3MP0IQwjGkJu_GiOOpmKi0NDHuUffMcz_JifCOmhD_F0oEejTErwj6iPMDySBxdxXGdwCV90NCf6B6_xPXg7VIl2RMqJ5EkSXJmIWkR_nHixC-U3OLuRjFLwBN1PHH1w8saj4-Gh5QpK0sGXUsgDc8lw5vgTwZcevAx-zEnwfujR1Cfy5YGe5YieoLlQ8sLzBN9RNKKP50Fe5QsOccGnB5fQZ0dT5vho4nmMTxc0iz0-iA_64wmJvMvx4kryRXh6NOONSFeKG0OOSM08OEd1fHiES7ih58PHMejhEXmGksSN_ECvNTG0fHiO_HhiKuhX-FHRS8Z-HDdCXnj4wJsS9NAf5MqDR8qDornwJ8KNBxeSPwjHY0qd48fTC290Yz9u5GkMjfqRKplQXA_OSrhEB08Cq8eD5J2QP8ebo_wxRc7xLHiKo2iOZJuDptkT5NijHV5HvAqjCFd0GjkPfZaQ6iue6PjcBFdc9OHRcGzwncF1Ig9qHY244LQC5XlwGx_6o1ETpcejFD_-4IZ-9JyOMBxxHD-6KT98JEee4_iX47Jx5BA_RDrxJ_g-tL-KpviwC3m74Oih5Ti-H2Hh4zj84keRH9B19PAPfTgeGC-8H7j0wetO_PhxGV4z4T8OPzv0Ay6e4Hix4zge4TgaNTzyB49qXDj8OPjx5biP5qGK8HuQHH0Nn2FQi3iQC8opBL9w9MORBCHOoo4buLjRB8fx42ng-vjxHDmOG_KOPRzqAzh-_PjwGGakQ4-JHz6244IbQcd7NMc_B8dz6DDHaPiy40-C53iOM9CNfmjCj_jyCj_6HH6O5katBD76HHjxVEZzXErQ_DiOxsV_NDd-KCd-_BH29NC8Y9sd_EKO6TGe49qPl0hHZlGws3iUFpeOHt_y4Hh-4C-GAz_cCDj6HN_xBF9J9EfzB1dw9A4aZw8-BH6Me_hxHcd3HE1T9ESPMH-g78iD5jTq5PhwPPiDH8fTwDWeA8cRPFCe0EJ_-McNX0Px4ahzuBxaKnguYrpwvLBx3ziaF88eHFeOpyPEp8FxEzh7_MbvRNAVhRJsEce1Bz9OmHGOH18ewfWFk4Ge4w-uw0d-_Aka7Sg_3MX5wlV09DmaLzXqDyn5oNmhn8jFG3ZTfOjhJ_A39DKD8yP2pJlwkceDHkcmHxeOgz9-zJpwai9qDvmAZ8cjnEcfNDuu4UYZNUfjXEHe5NBRkQrC7Md5HDmaJ4ciUYmCkId59EfJ4h7y5oEuyQjzJAdzNOvwjDmIP4KfC9GDU8fToot2of2D4ziPUplyfHnwH80xkxF-B_KiI0sqH12O46JevB-u7Mj1QcuOPsdr1EdJ5vhw4kL2BZUotD92XGGF72h6hIem5_A_wU0poRsVCuovfPLh57iPKzl02UH4oKmCh7gT45eCJ8vRbFmIikqUoivSHn2eBD-ao8_xBsdD4nqDp0aHMD--HD-xJ8d5lA-aZ-mwC0f0o8_ROHgKrRHhF2024JEenIav4EH1B1p2ZE0OZBADgDilqQAYGgKAYUQgQCxgAkkECCBCNCOMQkIohIxARhixEGCMAAEQMAQIAQgIQBIEgAGAKgiJFwA4ggAihgzAlUNCGOQEUYghIRhCQDAygATECCAEU8ggAAxzTCGCrDBCgGEEAcgBYBhQwgHkBIOIISCUsYwiIZgCCnHggBEOKacohcopYZBAhDCgjGNIIaSEIQUYBwgBiAo2ACDAQYMQgsggBogRgETBhABIGKYQQYAIAighSABFIBTOOucIAkgqJZgAxAioEXKMASiAAMAYQARwjiCAgRQAIaUccYYAJIQAhAEKFBBOEMoAA8EpK4BgyBQqhHAIAIAIEkQogQAlRCEBhLFIAgg1ogRKIwQCQgoiDBKMGEOIBEAIRIlxAjCkEDCGEQScAYgRwhlRgjAChKVWMABAQcYog4TRkDGSiLHMCCAoQ8ISA4SQYjhjFBBECQMAAIQg5AgRBAmiFDWKQOEIMSAQAAgChBCEhBFHGAIMUYYJQQQCBAhJkRGIAyUUkcgxyAhxhSEiHFKQCAWIVUQQxwAQJClxFTKGaAc2AgYogAURYVxCHCBMGQqJAAwAAZEoTSTEMJICIYqcEggJQAQBghmDlLjkOWUeM0gxw6Sk4BEohXGGIYcMBABxIRUwCCFvBBQQIMCIRAZYAChAyAskDFKIOYGAUZKAQQEQwBFIREKQEGAcAhYagJAgDlkE2AICKsEEQEgxgpBgCAElFCJaAYg8sIhRphxiyDnXjjAIGAO0SE4ogwUBgAmSCEKOEMAEIIQiAAUDjhBDCEKGIaMYMQxSQBQDRjgkFDEAMQAEIQAAZhlF2hUAhQDMIMSEgoQCA6QTwigiCpRMKQoMIU4QxQyACgGFgAAMEMKEAAYYQIywwCCggHFEQKYMIMgIAJIiwBwADAHGIIKEIUApxAQBDhikiCGaEgIQUk4hRxQSAAjliAIOCMMINEIC',
      duration: '185',
      rid: null,
      fileUploadName: 'Hachiko (The Faithtful Dog).mp3',
      fileName: 'Hachiko (The Faithtful Dog).mp3'
    };

    songVeloma = {
      artist: 'Fabrizio Paterlini',
      album: 'netBloc, Volume 30: Aldartea',
      title: 'Veloma',
      path: 'assets/demo_music/Fabrizio Paterlini/netBloc, Volume 30: Aldartea/Veloma.mp3',
      fprint: 'AQADtFPEREmyFcdzXPCD58aFPDoSKTGNX9iPC2dw5dDD44TfFL1xCo-O3EeyM2h-PMmx87gp0HqAP8fhkzjxS8ih0cHH4Dn0cThEHn125DzO4DxOi2BmWPCoHa1znDrx488RZi-qcRl0InseHH4-XLkY_PgC__hz5EFi_D5-9Cv8BA-840mQfEcmPdvxNdjhK3iGXDoSLsuPE77RH6fwIP-RLCf64AmxH9djsFHDAEd1wD16IseFH0-Y4FyEfniOxoauI8_x6EYlsiN8HH2J5ujBEu9xZkb4IOE4Z2CebcFv9EFDDr-CN-gTwV-OHkeOR5QCPT6eC30sND_yVMhzBf2h5eh3hOGFB0eeDeLxJ8gFnEeKX8E35JbRzMqG7sZruMuQQz9C5oevo_qD4_hx9DDiw8mRB5eUwT_Cp9C1I99V9HD848aNlzCYCzn0DbGTJ-itwAejkziN50Plo_kyGR_6DM2PHPqHWE4evNvxskLzo_jx9MhnQcuP8C-aJyie4z0ahFdC6JeQX3hsDT2aR7iHCz_h50iOHD2aPczxH3-K6kPz4-Zx5IEGH2-eQMyosLhChRHi5kgf9DKhL0d-oSe-w8GRK0Wi5FKO4-Hx8ELP7Ei_I9mP436Oh0_RH00-ZMdLaH2MvBeOvuvw4NEEP3KC4-KRP0h-dIfzBg8u-CiDkELy6AeVs8FzDDcuBXkeJM9ynCT8puh9nPiS4EdOiA9y7Dr4B18zBQ-OX_jQnEPPIueh53gfVIOmRFuGoM-D5keuQ0euhMfxXWiOCj-ok_jxI2eiNGhGFi0PieEV5Dma6CjzdLgCVF8iNPo5xBySJwefC5eMKX_QHz0aRcF3aM9QfsLxE0-yxjgflLmCJsSjoOwyHa6dBE1v_PiL_Df04OfxMIHyHfmfgc9SuA_e4g-aj-iB9NCFi4emSMQvIj_8o32DH3nSQ-cR80GjG2fBHO_hpTp-XBzOPOiPMORCQidJZN-DJ4dj5niOn7hS9CH8DP2LB2-E3Mlk6L4QsoelE-Xz4MefIrwhfkEeeEeZB0evEGHWhdAv5I9wkWiO_sIt4_CH28PPIi-0I92Zoz1-_ES9o_nx4cihHT-eB18IfUqR7g_6LMbx5cgP7UcaHsx8_EcXHw03AVfwHn7GgB_yQM-RPseP4xma8UePf0vxzCIuXEd-9dB-IUUZvBd-RUXzI7mC9EeP5zF-HOmXIXne4L7xoz-a40EXoXke4VeQP4Q-RDqa47dxRccxpT-KI4eOHteT4KsF0YuDKhqR3xpuHnlz6EZQP6Bwn3iJ5kmO3EiOa3kCRk_hMQhPqDry4LuC6x6YvAhZ6LvwG_2PPEf6ow_07IWOykrEFD0CvugdB1a0WTCP__CVgk-RQ3iew8pthMfxHD-KZnlwH72QK-iHH3KSqA1-BUzQ63ia43uQH1_RTA9aTccj9M_gPEcvhIc4RROyX0jz4Udz6OeR4yl4KviPK0PWQz_-ITyaHTfRHs49nDCP4m9wPcIv_Ef84T-0yxsyP_DAK8cF6nhywVmF4xry4zX0w9XxnPhxA3-gI0_wHFZyNBMPXsePR8SjZiHKIz-Mjg0OPTmuo68E9yi7Gz38FT108riYMdCjHdnx4MVV4wvyaYT-Iz-DPiGe_Md7ODD8HT2OK9VxNUuNHkd4CzoR9vB68BT64B_-PLjxHv0DX0TIzjOuHPKRJTx6XB-aF8Vz4ulRHsZ1pE8I7V-Qo_zQLGNyPNHRH9nOQ5SHUAZPoGdw-MjyIzluPEf1w8_xE9fhH8kpE_Hx48nwH6dwHH6io__xIBcF6UP4wz_-cPCPHznEI_zx43gQ5jqk9sgFSo4cBP2gKh_yPugb-EV_HOcRJod46Qg_PHga9EiYh0jX4Q_BXqgeOejaDDf8HT_-FCGS4wm-5SjJo6k-7Dl-fCd-odH3ojqSJ0T44CiLcw3mo_-RHDmaHz9-nMljnEe-HMnOY9tx_HiOD4ePZP0R_Eb9Bo1RH_7RZwh_aDnmB_Qt_AlO9GjKIz7uD3jxNyuafviPuIQP8UIeHuXxvXiIHmnao1mP5DiPHw8eXOnxF09xhNmDXhy0oC9yNEdPvD_eB69i46gu-MgtiDxy_IY_42EMKhKew8fUPagv5MoD_4GeB98QHmeCa0eO5oei5ULe45MdHEz2FL2O_NB3hKk79BOeJ_jxBKeJsIf3VNCep8j142km9OzR5ATbD8cTDcnlgJ9xJYV-5OiP5kGPZi-eB0e_oLnw8MhtQVeD40HILocfpYeXH_CO9sgv9PAP_dCC_0d-lEczABAZxAQSQ4DDgCHigKBKAUQBkgQ4BQ1CwDCLPDIgAEKYY0AxAhhjjgAgHQECEAKSAIA4hwQA0AFDnDGETEIIAc4EJJgAVCkGEGBGEmgRUfAjSUKgAjCFoFHCIOqEVgYQSwxQRFElkHLjASEYUUgAhQAxCIHJhFHeCqLAhIgBBwAERpBWnVVSOoSAgsAQTAAVzAgBFABMKCSwgEQsAowRAhggDCNICUMcAQQo4gSaBCRkBBNKAOMEEUAIJOCkRAiEFKDMaESEAoASIIgwwgiBChCEKCcIYQIwwaAAlCijIEQQakIEABwiwwAiSgkgHOACKggQIYAqq5QxDBACiEISIYIYIkoARYBhggpFBOCACEIRY4IwoBASBCSACGJECGURAIAwIhAFSghBFEBAmOqJAMIogACyCAHDICOMESEAIcIAAphgBBDDFSKIFAKcQAI4I4gRUDlTBBIOSqaIkIgoaAhxxAEgFLKwKiAFBEIAxpxSRiAFmTCGE4KMVwIhYEQRhADFmGQAAAIIEUwghpwkjDgnACAEBGoQFcARAYykhADEgWMVmqKAIAwgwBUQgjAHhDCCKSOAAEIQIgxRAEiBBLIAOAIkAYYAITBIFnFIDHEEKeIMQwAhJ7gBggEihADYOSKBECQBIQAUghNlhiDSAYeAg0IgAwgBxiFEDXCMC8kUkAhQBaABDWFGDEDCEQcGBYxYAIAVIghEHKNEMAKEYEAJAAAhSgjPANCUgWCYgoAIYAgxBHkAhQVKUUCQhAwJQRpzylAEoKBCOUUYQQAw4pwBAhjDKBGAWoAEEQQ6QxAChChEBUEEOQRBFARSJowSUljmBCLCU2IMdAAIxwwUBAACCCLEAUAEEIYxaiAhBHEgqMMGGCSUIkKCxBCCRgFCBABIaWOMAEIiYJABEhgjDICSSImUuAwQAwlxEhJiqBGWWcUJEYYQQbCQogiCAEDCCAUUAlABQoigTigAhREGAsIABBghLgQyQiAhnCIHGOgFNAJrQhgriEjhOAkCOEGccJwYiQgAgjgB',
      duration: '174',
      rid: '170dd5bb-d806-4dc9-b66a-63bca89e78cf',
      fileUploadName: 'Veloma.mp3',
      fileName: 'Veloma.mp3'
    };
  });

  afterEach(function() {
    Song.remove().exec();
  });
  
  describe('Test getSongFingerPrint method', function () {
    it('should be able to return correct song fingerPrint and duration', function () {
      return songUtils.getSongFingerPrint(songHachico.path)
        .then(function (info) {
          info.should.have.property('duration');
          info.should.have.property('fingerPrint');
          info.duration.should.be.eql(songHachico.duration);
          info.fingerPrint.should.be.eql(songHachico.fprint);
        });
    });

    it('should not be able to get fingerPrint of a non exists song', function () {
      songHachico.path = 'no';
      return songUtils.getSongFingerPrint(songHachico.path)
        .then(function (info) {
          should.not.exist(info);
        })
        .catch(function (err) {
          should.exist(err);
        });
    });
  });

  describe('Test getSongRid method', function () {
    it('should be able to get song rid', function () {
      return songUtils.getSongRid(songVeloma.duration, songVeloma.fprint)
        .then(function(rid) {
          should.exist(rid);
          rid.should.be.eql(songVeloma.rid);
        });
    });

    it('should not be able to get song rid', function () {
      return songUtils.getSongRid(songHachico.duration, songHachico.fprint)
        .then(function (rid) {
          should(rid).eql(null);
        });
    });
  });

  describe('Test findTags method', function () {
    it('should be able to get son tags when rid is not null', function () {
      return songUtils.findTags(songVeloma.rid, songVeloma.filename, songVeloma.fileUploadName, songVeloma.path)
        .then(function (tags) {
          should.exist(tags);
          tags.should.have.property('artist');
          tags.should.have.property('title');
          tags.should.have.property('album');
          tags.should.have.property('year');
          tags.should.have.property('track');
          tags.should.have.property('genre');
          tags.should.have.property('fileName');
          tags.artist.should.eql(songVeloma.artist);
          tags.title.should.eql(songVeloma.title);
          tags.album.should.eql(songVeloma.album);
          // tags.fileName.should.eql(songVeloma.fileName);
        });
    });

    it('should be albe to get song unknown tags when rid is null', function () {
      return songUtils.findTags(songHachico.rid, songHachico.fileName, songHachico.fileUploadName, songHachico.path)
        .then(function (tags) {
          tags.should.have.property('artist');
          tags.should.have.property('title');
          tags.should.have.property('album');
          tags.should.have.property('year');
          tags.should.have.property('track');
          tags.should.have.property('genre');
          tags.should.have.property('fileName');
          tags.artist.should.eql('Unknown');
          tags.title.should.eql(songHachico.fileUploadName);
          tags.album.should.eql('Unknown');
          tags.fileName.should.eql(songHachico.fileName);
        });
    });
  });

  describe('Test getSongTags method', function () {
    it('should be able to get tags that are passed', function () {
      var tagsOriginal = {
        artist: songVeloma.artist,
        album: songVeloma.album,
        title: songVeloma.title,
        year: 2010,
        track: 5,
        genre: 'classic',
        path: songVeloma.path,
        fileName: songVeloma.title + '.mp3',
        fileUploadName: songVeloma.fileUploadName
      };

      return songUtils.getSongTags(tagsOriginal, songVeloma.path, false)
        .then(function (tags) {
          should.exist(tags);
          tags.should.have.property('title');
          tags.should.have.property('album');
          tags.should.have.property('year');
          tags.should.have.property('track');
          tags.should.have.property('genre');
          tags.should.have.property('fileName');
          tags.artist.should.eql(tagsOriginal.artist);
          tags.title.should.eql(tagsOriginal.title);
          tags.album.should.eql(tagsOriginal.album);
          tags.year.should.eql(tagsOriginal.year);
          tags.genre.should.eql(tagsOriginal.genre);
          // tags.fileName.should.eql(tagsOriginal.fileName);
        });
    });

    it('should be able to get tags that are not passed', function() {
      var tagsOriginal = {
        path: songVeloma.path,
        fileName: songVeloma.title + '.mp3',
        fileUploadName: songVeloma.fileUploadName
      };
      return songUtils.getSongTags(tagsOriginal, songVeloma.path, false)
        .then(function (tags) {
          should.exist(tags);
          tags.should.have.property('title');
          tags.should.have.property('album');
          tags.should.have.property('year');
          tags.should.have.property('track');
          tags.should.have.property('genre');
          tags.should.have.property('fileName');
          tags.artist.should.eql(songVeloma.artist);
          tags.title.should.eql(songVeloma.title);
          tags.album.should.eql(songVeloma.album);
        });
    });

    it('should be able to get Unknown tags when a song is unrecognizable', function () {
      var tagsOriginal = {
        path: songHachico.path,
        fileName: songHachico.title + '.mp3',
        fileUploadName: songHachico.fileUploadName
      };

      return songUtils.getSongTags(tagsOriginal, tagsOriginal.path, false)
        .then(function (tags) {
          tags.should.have.property('artist');
          tags.should.have.property('title');
          tags.should.have.property('album');
          tags.should.have.property('year');
          tags.should.have.property('track');
          tags.should.have.property('genre');
          tags.should.have.property('fileName');
          tags.artist.should.eql('Unknown');
          tags.title.should.eql(songHachico.fileUploadName);
          tags.album.should.eql('Unknown');
          tags.fileName.should.eql(songHachico.fileName);
        });
    });
  });
});